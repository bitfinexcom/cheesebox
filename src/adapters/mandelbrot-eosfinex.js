'use strict'

const MB = require('./mandelbrot-base.js')

const decimalsFormatter = (opts) => {
  const { decimals } = opts

  return (el) => {
    el.price = +el.price / 10 ** decimals
    el.amount = +el.amount / 10 ** decimals
    return el
  }
}

class MandelbrotEosfinex extends MB {
  constructor (conf = {}) {
    super(conf)

    this.conf = conf

    this.sb = conf.sunbeam
    this.user = conf.user

    this.subscriptions = {}
  }

  orderbook (q, opts = {}) {
    const pair = q.pair
    const decimals = 10
    const account = this.user.name

    return new Promise((resolve, reject) => {
      this.sb.orderbook(pair, {}, (err, res) => {
        if (err) return reject(err)

        const { bids, asks } = res

        const sortedAsks = asks.sort((a, b) => a.price - b.price)
        const sortedBids = bids.sort((a, b) => b.price - a.price)

        const f = decimalsFormatter({ decimals: decimals })
        const t = (side) => {
          return (el) => {
            // For Trading: if AMOUNT > 0 then bid else ask.
            if (side === 'asks') {
              el.qty = '-' + el.qty
            }

            const res = f({
              orderID: el.id,
              price: el.price,
              amount: el.qty,
              belongsToUser: el.account === account
            })

            return res
          }
        }

        const final = {
          asks: sortedAsks.map(t('asks')),
          bids: sortedBids.map(t('bids'))
        }

        resolve(final)
      })
    })
  }

  orders (q, opts = {}) {
    const { pair } = q
    const decimals = 10

    return new Promise((resolve, reject) => {
      this.sb.orders(pair, {}, (err, res) => {
        if (err) return reject(err)

        const { asks, bids } = this.sb.transformApi2(res)

        const t = (el) => {
          el.belongsToUser = true
          return el
        }
        const final = {
          asks: asks.map(decimalsFormatter({ decimals: decimals })).map(t),
          bids: bids.map(decimalsFormatter({ decimals: decimals })).map(t)
        }

        resolve(final)
      })
    })
  }

  cancel (q) {
    return new Promise((resolve, reject) => {
      const data = {
        id: q.orderID + '',
        side: q.side.replace(/s$/, ''),
        symbol: q.pair
      }

      this.sb.cancel(data, {}, (err, res) => {
        if (err) return reject(err)

        resolve(res)
      })
    })
  }

  place (q, opts) {
    const order = this.getOrder(q)

    return new Promise((resolve, reject) => {
      this.sb.place(order, (err, res) => {
        if (err) return reject(err)

        resolve(res)
      })
    })
  }

  getOrder (data) {
    delete data.user
    data.symbol = data.pair
    delete data.pair
    // order helper to transform input data
    // to required format for order submission

    /*
    const orderBuyPo = sb.createOrder({
      symbol: 'BTC.USD',
      price: '0.1',
      amount: '0.1',
      type: 'EXCHANGE_LIMIT',
      clientId: '1337',
      flags: '1'
    })
    */

    return this.sb.createOrder(data)
  }

  wallet () {
    return new Promise((resolve, reject) => {
      this.sb.balance((err, data) => {
        if (err) return reject(err)

        const res = data.map((el) => {
          const tmp = el.split(' ')
          return {
            currency: tmp[1],
            balance: tmp[0]
          }
        })

        resolve(res)
      })
    })
  }
}

module.exports = MandelbrotEosfinex
