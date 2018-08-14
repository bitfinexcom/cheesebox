'use strict'

import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import linkState from 'linkstate'

import fetch from 'cross-fetch'


import getOrder from './order-helper.js'

import { Provider } from 'react-redux'
import configureStore from './configureStore.js'
import { connect } from 'react-redux'


import {
  setPairPairs,
  login
} from './actions.js'

import OrderbookRow from './common/book-positions-row.jsx'
import ErrorBox from './common/errorbox.jsx'
import PositionsContainer from './containers/positions.jsx'
import OrderbookContainer from './containers/orderbook.jsx'

class MandelbrotHttp {
  constructor (conf = {}) {
    this.conf = conf
  }

  orderbook (q, opts = { limit: 10 }) {
    const pair = q.pair

    function processBook (res) {
      const tmpOb = res[0]

      if (!tmpOb) return { asks: [], bids: []}
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
          return { orders: orders, orderbook: orderbook}
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

  wallet (q, opts = {}) {
    const { id } = q

    return this.send(['get_wallet', [id, 'exchange']])
      .then((res) => {
        console.log(res)
      })
  }

  getOrder (data) {
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

const sbConf = { dev: true, account: 'testuser4321' }
const user = { id: 1, name: 'testuser' }

const mb = new MandelbrotHttp({
  endpoint: 'http://localhost:8000/gateway',
  user: user
})

const conf = {
  dev: true,
  user: user,
  exchangeName: 'Cantor Exchange',
  pair: 'BTCUSD',
  pairs: [
    'BTCUSD',
    'ETHUSD'
  ],
  client: mb
}

class Clock extends Component {
  constructor (props) {
    super(props)

    this.state = {
      time: new Date()
    }
  }

  componentDidMount () {
    setInterval(() => {
      this.setState({ time: new Date() })
    }, 1000)
  }

  render () {
    const { time } = this.state
    return <time dateTime={time.toISOString()}>{ time.toLocaleTimeString() }</time>
  }
}

const Select = (props) => {
  const { pairs, pair, eventBinding } = props

  const opts = pairs.map((el, i) => {
    return <option key={i} value={el}>{el}</option>
  })

  return (
    <label>
      <select value={pair} onChange={eventBinding}>
        {opts}
      </select>
    </label>
  )
}

const SubmitOrder = (props) => {
  const {
    handleSubmit,
    type,
    amount,
    price,
    postonly,
    onAmountChange,
    onPriceChange,
    onPostOnlyChange,
    onTypeChange
  } = props

  return (
    <div className='column column-25'>
      <form onSubmit={handleSubmit}>
        <div>
          <label className='submit__checkbox__buy'>
            Buy
            <input
              className='submit__checkbox__ordertype'
              type='radio'
              value='buy'
              checked={type === 'buy'}
              onChange={onTypeChange} />
          </label>

          <label className='submit__checkbox__sell'>
            Sell
            <input
              className='submit__checkbox__ordertype'
              type='radio'
              value='sell'
              checked={type === 'sell'}
              onChange={onTypeChange} />
          </label>
        </div>
        <label>
          Amount:
          <input type='text' value={amount} onInput={onAmountChange} />
        </label>
        <label>
          Price:
          <input type='text' value={price} onInput={onPriceChange} />
        </label>
        <label>
          <input className='submit__postonly' type='checkbox' value={postonly} onInput={onPostOnlyChange} />
          Post Only
        </label>
        <button className='button-black submit__button'>Submit</button>
      </form>
    </div>
  )
}

class App extends Component {
  constructor (props) {
    super(props)

    this.conf = props.conf


    this.client = this.conf.client
  }

  componentDidMount() {
    const { dispatch } = this.props

    const availablePairs = { pair: this.conf.pair, pairs: this.conf.pairs }
    dispatch(setPairPairs(availablePairs))

    // stub login
    dispatch(login(this.conf.user))
  }

  onPairChange (event) {
    const { dispatch } = this.props

    dispatch(setPairPairs({ pair: event.target.value }))
  }

  handleSubmit (event) {
    event.preventDefault()

    const state = this.state

    const amnt = state.type !== 'buy' ? (state.amount * -1) + '' : state.amount

    const order = this.client.getOrder({
      id: null, // assigned from endpoint
      pair: state.pair,
      price: state.price,
      amount: amnt,
      type: 'EXCHANGE_LIMIT',
      user_id: this.conf.user.id,
      postOnly: 0
    })

    this.client.send(['insert_order', order])
      .then((res) => {
        console.log('res', res)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  render () {

    const {
      pairs,
      pair,
      type,
      amount,
      price,
      postonly,
      error
    } = this.props

    const { exchangeName } = this.conf
    const { user } = this.props

    return (
      <div className='container'>
        <div className='row'>
          <div className='column'><Clock /> - {user.name} - {exchangeName}</div>
          <div className='column column-25'>
            <div>
              <Select
                pair={pair}
                pairs={pairs}
                eventBinding={this.onPairChange.bind(this)}
              />
            </div>
          </div>
        </div>
        <div className='infobox'>
          { error ? <ErrorBox error={error.message} /> : null}
        </div>
        <div className='app__middlescreen' className='row'>
          <SubmitOrder
            pair={pair}
            type={type}
            amount={amount}
            price={price}
            postonly={postonly}
            onAmountChange={linkState(this, 'amount')}
            onPriceChange={linkState(this, 'price')}
            onPostOnlyChange={linkState(this, 'postonly')}
            onTypeChange={linkState(this, 'type', 'target.value')}
            handleSubmit={this.handleSubmit.bind(this)} />
          <PositionsContainer client={this.client} />
        </div>
        <div className='row'>
          <div className='column'>
            <OrderbookContainer client={this.client} />
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  const {
    pairPairs,
    user
  } = state

  return {
    ...pairPairs,
    ...user
  }
}

const MappedApp = connect(mapStateToProps)(App)
const store = configureStore()

ReactDOM.render((
  <Provider store={store}>
    <MappedApp conf={conf} />
  </Provider>
), document.getElementById('root'))
