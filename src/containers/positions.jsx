'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'

import OrderbookRow from '../common/book-positions-row.jsx'
import ErrorBox from '../common/errorbox.jsx'

import {
  setPositions
} from '../actions.js'

class PositionsContainer extends Component {
  constructor (props) {
    super(props)

    this.client = this.props.client
  }

  updateInterval (pair, user) {
    const { dispatch } = this.props

    if (this.periodicFetch) {
      clearInterval(this.periodicFetch)
    }

    this.periodicFetch = setInterval(() => {
      this.client.orders({ pair: pair, user: user })
        .then((res) => {
          const pl = { asks: res.asks, bids: res.bids, error: null }
          dispatch(setPositions(pl))
        })
        .catch((err) => {
          dispatch(setPositions({ asks: [], bids: [], error: err }))
        })
    }, 1000)
  }

  componentWillReceiveProps (props) {
    const { user, pair } = props

    if (props.pair === this.props.pair) {
      return false
    }

    this.updateInterval(pair, user)
  }

  componentWillUnmount () {
    clearInterval(this.periodicFetch)
  }

  cancelOrder (data) {
    this.client.cancel(data)
  }

  render () {
    const {
      bidsPositions = [],
      asksPositions = [],
      errorPositions =  null,
      pair = ''
    } = this.props

    return (
      <PositionsInternal
        pair={pair}
        bids={bidsPositions}
        asks={asksPositions}
        error={errorPositions}
        cancelcb={(id, side) => {
          this.cancelOrder(id, symbol, s)
        }}
      />
    )
  }
}

class PositionsInternal extends Component {
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
      <div className='column column-65 column-offset-10 positions__internal'>
        <div className='positions__title'>
          Positions for {pair}
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
        <div className='positions__bids'>
          {
            bids.map((bidRow, i) => {
              return <OrderbookRow key={i} data={bidRow} cancelcb={cancelcb} side='bids' />
            })
          }
        </div>
        <div className='positions__asks'>
          {
            asks.map((askRow, i) => {
              return <OrderbookRow key={i} data={askRow} cancelcb={cancelcb} side='asks' />
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
    positions
  } = state


  return {
    ...pairPairs,
    ...user,
    ...positions
  }
}

export default connect(mapStateToProps)(PositionsContainer)
