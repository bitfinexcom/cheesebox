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

function positions (state = { bidsPositions: [], asksPositions: [], errorPositions: null }, action) {
  const { type, payload } = action

  switch (type) {
    case POSITIONS:
      const data = {
        bidsPositions: payload.bids,
        asksPositions: payload.asks,
        errorPositions: payload.error
      }

      return {
        ...state,
        ...data
      }
    default:
      return state
  }
}

function orderbook (state = { asks: [], bids: [], errorOb: null }, action) {
  const { type, payload } = action

  switch (type) {
    case ORDERBOOK:
      const data = {
        bids: payload.bids,
        asks: payload.asks,
        errorOb: payload.error
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
        wallet: data
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
