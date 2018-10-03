'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'

import OrderbookRow from '../common/book-orders-row.jsx'
import ErrorBox from '../common/errorbox.jsx'

import {
  setOrders
} from '../actions.js'

class OrdersContainer extends Component {
  constructor (props) {
    super(props)

    this.client = this.props.client
  }

  componentDidMount () {
    const { pair } = this.props

    this.client.once('open', () => {
      this._sub(pair)
    })
  }

  componentWillReceiveProps (props) {
    const { pair } = props

    if (pair !== this.props.pair) {
      this.client.onManagedOrdersUpdate({ symbol: this.props.pair }, () => {})
      this.subscribe(pair)
    }
  }

  componentWillUnmount () {
    this.client.onManagedOrdersUpdate({ symbol: this.props.pair }, () => {})
    this.client.unSubscribeOrders()
  }

  subscribe (pair) {
    if (!this.client.connected) return
    if (!pair) return

    this._sub(pair)
  }

  _sub (pair) {
    const { dispatch } = this.props

    this.client.onManagedOrdersUpdate({}, (orders) => {
      dispatch(
        setOrders({ orders, pair })
      )
    })

    this.client.auth()
  }

  cancelOrder (data) {
    this.client.cancel(data)
  }

  render () {
    const {
      bidsOrders = [],
      asksOrders = [],
      errorOrders = null,
      pair = ''
    } = this.props

    return (
      <OrdersInternal
        pair={pair}
        bids={bidsOrders}
        asks={asksOrders}
        error={errorOrders}
        cancelcb={(data) => {
          this.cancelOrder(data)
        }}
      />
    )
  }
}

class OrdersInternal extends Component {
  render () {
    const {
      bids = [],
      asks = [],
      error = false,
      cancelcb = () => console.log('cancelcb called for positions'),
      pair
    } = this.props

    if (error) {
      return <ErrorBox error={error.message} />
    }

    return (
      <div className='column column-65 column-offset-10 orders__internal'>
        <div className='orders__title'>
          Orders for {pair}
        </div>
        <div className='orderbook__explaintable rowI'>
          <div className='row__price'>
            Price
          </div>
          <div className='row__quantity'>
            Quantity
          </div>
          <div className='row__cancelbutton' />
        </div>
        <div className='orders__bids'>
          {
            bids.map((bidRow, i) => {
              return <OrderbookRow key={i} data={bidRow} cancelcb={cancelcb} pair={pair} side='bids' />
            })
          }
        </div>
        <div className='orders__asks'>
          {
            asks.map((askRow, i) => {
              return <OrderbookRow key={i} data={askRow} cancelcb={cancelcb} pair={pair} side='asks' />
            })
          }
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  const {
    pairPairs,
    user,
    orders
  } = state

  return {
    ...pairPairs,
    ...user,
    ...orders
  }
}

export default connect(mapStateToProps)(OrdersContainer)
