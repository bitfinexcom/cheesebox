'use strict'

const fetch = require('cross-fetch')

const MB = require('./mandelbrot-base.js')
const getOrder = require('./mandelbrot-hive-order-helper.js')

class MandelbrotHive extends MB {
  constructor (conf = {}) {
    super(conf)

    this.conf = conf
  }

  orderbook (q, opts = { limit: 10 }) {
    const pair = q.pair

    function processBook (res) {
      const tmpOb = res[0]

      if (!tmpOb) return { asks: [], bids: [] }

      const asks = tmpOb.filter(el => el[2] > 0)
      const bids = tmpOb.filter(el => el[2] < 0)

      const mp = (el) => {
        // [price, count, amount]
        const order = {
          id: null,
          price: Math.abs(el[0]),
          amount: el[2]
        }

        return order
      }

      const ob = {
        asks: bids.map(mp).sort((a, b) => b.price - a.price),
        bids: asks.map(mp).sort((a, b) => a.price - b.price)
      }

      return ob
    }

    return this.send(['get_book_depth', pair, opts])
      .then((res) => {
        return processBook(res)
      })
      .then((orderbook) => {
        // implementation specific: get the required data to indicate orders belonging to the user
        // could also go into gateway or get part of the redux code,
        return this.orders({
          pair,
          user: this.conf.user
        })
          .then((orders) => {
            return { orders: orders, orderbook: orderbook }
          })
      })
      .then((tmp) => {
        const { orders, orderbook } = tmp

        const prices = {
          asks: orders.asks.map((o) => { return o.price }),
          bids: orders.bids.map((o) => { return o.price })
        }

        const maybeAddIndicator = (side) => {
          return (el) => {
            if (prices[side].includes(el.price)) {
              el.belongsToUser = true
            }

            return el
          }
        }

        const res = {
          asks: orderbook.asks.map(maybeAddIndicator('asks')),
          bids: orderbook.bids.map(maybeAddIndicator('bids'))
        }

        return res
      })
  }

  orders (q, opts = {}) {
    const { pair, user } = q
    const id = user.id

    return this.send(['get_user_orders', [ pair, id ]])
      .then((res) => {
        const bids = res[0].filter(el => el.amount > 0)
        const asks = res[0].filter(el => el.amount < 0)

        return {
          asks,
          bids
        }
      }).then((res) => {
        const t = (el) => {
          const {
            id,
            type,
            price,
            amount
          } = el

          return {
            id,
            type,
            price,
            amount,
            belongsToUser: true
          }
        }

        return {
          asks: res.asks.map(t),
          bids: res.bids.map(t)
        }
      })
  }

  cancel (q) {
    const data = { v_pair: q.pair, id: q.id }

    return this.send(['cancel_order', data])
  }

  wallet (q, opts = {}) {
    const { id } = this.conf.user

    return this.send(['get_wallet', [id, 'exchange']])
      .then((data) => {
        const balances = data[0]

        const res = Object.keys(balances).map((k) => {
          const el = balances[k]
          return {
            currency: el.currency,
            balance: el.balance
          }
        })

        return res
      })
  }

  place (q, opts) {
    const order = this.getOrder(q)

    return this.send(['insert_order', order])
      .then((res) => {
        return res
      })
  }

  getOrder (data) {
    const { user } = data

    data.user_id = user.id
    delete data.user

    data.type = data.type.replace('_', ' ', 'g') // EXCHANGE_LIMIT -> EXCHANGE LIMIT

    // order helper to transform input data
    // to required format for order submission
    return getOrder(data)
  }

  send (payload, p = '', opts = {}) {
    return fetch(this.conf.endpoint + p, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.status >= 400) {
        throw new Error('Bad response from server', res.status)
      }

      return res.json()
    })
  }
}

module.exports = MandelbrotHive
