'use strict'

import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import linkState from 'linkstate'
import { connect } from 'react-redux'

import {
  setPairPairs,
  login
} from '../actions.js'

import ErrorBox from '../common/errorbox.jsx'
import OrdersContainer from '../containers/orders.jsx'
import OrderbookContainer from '../containers/orderbook.jsx'
import WalletContainer from '../containers/wallet.jsx'
import PositionsContainer from '../containers/positions.jsx'

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
    onTypeChange,
    marginEnabled,
    margin,
    onMarginChange
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
          <input type='text' value={amount} onChange={onAmountChange} />
        </label>
        <label>
          Price:
          <input type='text' value={price} onChange={onPriceChange} />
        </label>
        <div>
          <label>
            <input className='submit__postonly' type='checkbox' value={postonly} onChange={onPostOnlyChange} />
            Post Only
          </label>
          { marginEnabled
            ? <label>
              <input className='submit__margin' type='checkbox' value={margin} onChange={onMarginChange} />
              Margin Order
            </label> : null
          }
        </div>
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

    this.state = {
      ordertype: 'EXCHANGE_LIMIT',
      type: '',
      amount: '',
      price: '',
      margin: false,
      postonly: false
    }
  }

  componentDidMount () {
    const { dispatch } = this.props

    const availablePairs = { pair: this.conf.pair, pairs: this.conf.pairs }
    dispatch(setPairPairs(availablePairs))

    // stub login
    dispatch(login(this.conf.user))

    this.client.on('error', (err) => {
      console.error(err)
      console.log(err.msg)
      console.log(err.info)
    })
  }

  onPairChange (event) {
    const { dispatch } = this.props

    dispatch(setPairPairs({ pair: event.target.value }))
  }

  handleSubmit (event) {
    event.preventDefault()

    const state = this.state
    const { pair } = this.props

    const amnt = state.type !== 'buy' ? (state.amount * -1) + '' : state.amount

    const type = state.margin
      ? state.ordertype.replace(/EXCHANGE_/g, '')
      : state.ordertype

    const order = {
      symbol: pair,
      price: state.price,
      amount: amnt,
      type: type,
      postOnly: state.postonly
    }

    this.client.place(order)
  }

  render () {
    const {
      pairs,
      pair,
      error,
      user
    } = this.props

    const {
      type,
      amount,
      price,
      postonly,
      margin
    } = this.state

    const { exchangeName } = this.conf

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
        <div className='app__middlescreen row'>
          <SubmitOrder
            pair={pair}
            type={type}
            amount={amount}
            price={price}
            postonly={postonly}
            margin={margin}
            marginEnabled={this.conf.margin}
            onAmountChange={linkState(this, 'amount')}
            onPriceChange={linkState(this, 'price')}
            onPostOnlyChange={linkState(this, 'postonly')}
            onMarginChange={linkState(this, 'margin')}
            onTypeChange={linkState(this, 'type', 'target.value')}
            handleSubmit={this.handleSubmit.bind(this)} />
          <OrdersContainer client={this.client} />
        </div>
        <div className='row'>
          <WalletContainer client={this.client} />
          { this.conf.margin ? <PositionsContainer client={this.client} /> : null}
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

export default connect(mapStateToProps)(App)
