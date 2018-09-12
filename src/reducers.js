import { combineReducers } from 'redux'

import {
  PAIR_PAIRS,
  LOGIN,
  POSITIONS,
  ORDERBOOK,
  WALLET
} from './actions.js'

function pairPairs (state = { pairs: [], pair: '' }, action) {
  const { type, payload } = action

  switch (type) {
    case PAIR_PAIRS:

      const data = payload
      if (!data.pairs) {
        delete data.pairs
      }

      return {
        ...state,
        ...data
      }
    default:
      return state
  }
}

function positions (state = { bidsPositions: [], asksPositions: [] }, action) {
  const { type, payload } = action

  switch (type) {
    case POSITIONS:
      const { orders, pair } = payload

      const res = orders.map((el) => {
        el.belongsToUser = true
        return el
      }).reduce((acc, el) => {
        // filter out cancelled
        if (el.amount === 0) return acc

        // if pair is passed, filter pairs
        if (pair && pair !== el.symbol) return acc

        if (el.amount > 0) {
          acc.bids.push(el)
          return acc
        }

        acc.asks.push(el)
        return acc
      }, { asks: [], bids: [] })

      const { bids, asks } = res

      const data = {
        bidsPositions: [ ...bids ],
        asksPositions: [ ...asks ]
      }

      return {
        ...state,
        ...data
      }
    default:
      return state
  }
}

function orderbook (state = { asks: [], bids: [] }, action) {
  const { type, payload } = action

  switch (type) {
    case ORDERBOOK:
      const { bids, asks } = payload

      const data = {
        bids: [ ...bids ],
        asks: [ ...asks ]
      }

      return {
        ...state,
        ...data
      }
    default:
      return state
  }
}

function user (state = { user: { name: '', id: '' } }, action) {
  const { type, payload } = action

  const data = payload
  switch (type) {
    case LOGIN:

      return {
        ...state,
        user: {
          ...data
        }
      }
    default:
      return state
  }
}

function wallet (state = { wallet: [] }, action) {
  const { type, payload } = action

  const data = payload

  switch (type) {
    case WALLET:

      return {
        ...state,
        wallet: [ ...data ]
      }
    default:
      return state
  }
}

const rootReducer = combineReducers({
  pairPairs,
  user,
  positions,
  orderbook,
  wallet
})

export default rootReducer
