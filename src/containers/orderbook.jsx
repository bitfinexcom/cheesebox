'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'

import OrderbookRow from '../common/book-positions-row.jsx'
import ErrorBox from '../common/errorbox.jsx'

import {
  setOrderbook
} from '../actions.js'

class OrderbookContainer extends Component {
  constructor (props) {
    super(props)

    this.client = this.props.client
  }

  _sub (pair) {
    const { dispatch } = this.props

    this.client.unSubscribeOrderBook(pair)

    this.client.onManagedOrderbookUpdate({ symbol: pair }, (ob) => {
      dispatch(setOrderbook(ob))
    })

    this.client.subscribeOrderBook(pair)
  }

  componentDidMount () {
    const { pair } = this.props

    this.client.once('open', () => {
      this._sub(pair)
    })
  }

  subscribe (pair) {
    if (!this.client.connected) return
    if (!pair) return

    this._sub(pair)
  }

  unsubscribe (pair) {
    this.client.unSubscribeOrderBook(pair)
    this.client.onManagedOrderbookUpdate({ symbol: pair }, () => {})
  }

  componentWillReceiveProps (props) {
    const { pair } = props

    if (pair !== this.props.pair) {
      this.unsubscribe(this.props.pair)
      this.subscribe(pair)
    }
  }

  componentWillUnmount () {
    const { pair } = this.props
    this.client.onManagedOrderbookUpdate({ symbol: pair }, () => {})

    this.client.unSubscribeOrderBook(pair)
  }

  render () {
    const {
      bids,
      asks,
      error
    } = this.props

    return (
      <OrderbookInternal
        bids={bids}
        asks={asks}
        error={error}
        cancelcb={false}
      />
    )
  }
}

class OrderbookInternal extends Component {
  render () {
    const {
      bids = [],
      asks = [],
      error = false
    } = this.props

    if (error) {
      return <ErrorBox error={error.message} />
    }

    return (
      <div className='orderbook__internal'>
        <div className='row orderbook__title'>
          <div className='orderbook__title-wrap column column-40'>
            <h2 className='orderbook__title-bids'>
              Bids
            </h2>
          </div>
          <div className='orderbook__title-wrap column column-40 column-offset-20'>
            <h2 className='orderbook__title-asks'>
              Asks
            </h2>
          </div>
        </div>
        <div className='row'>
          <div className='column column-40'>
            <OrderbookSide data={bids} cancelcb={false} side='bids' />
          </div>
          <div className='column column-40 column-offset-20'>
            <OrderbookSide data={asks} cancelcb={false} side='asks' />
          </div>
        </div>
      </div>
    )
  }
}

class OrderbookSide extends Component {
  render () {
    const {
      data = [],
      side
    } = this.props
    return (
      <div className='orderbook__side'>
        <div className='orderbook__explaintable rowI'>
          <div className='row__price'>
            Price
          </div>
          <div className='row__quantity'>
            Quantity
          </div>
          <div className='row__cancelbutton' />
        </div>
        {
          data.map((dataRow, i) => {
            return (<OrderbookRow key={i} data={dataRow} cancelcb={false} side={side} />)
          })
        }
      </div>
    )
  }
}

function mapStateToProps (state) {
  const {
    pairPairs,
    user,
    orderbook
  } = state

  return {
    ...pairPairs,
    ...user,
    ...orderbook
  }
}

export default connect(mapStateToProps)(OrderbookContainer)
