'use strict'

export const PAIR_PAIRS = 'PAIR_PAIRS'
export const LOGIN = 'LOGIN'
export const POSITIONS = 'POSITIONS'
export const ORDERS = 'ORDERS'
export const ORDERBOOK = 'ORDERBOOK'
export const WALLET = 'WALLET'

export function setPairPairs (payload) {
  return {
    type: PAIR_PAIRS,
    payload
  }
}

export function login (payload) {
  return {
    type: LOGIN,
    payload
  }
}

export function setPositions (payload) {
  return {
    type: POSITIONS,
    payload
  }
}

export function setOrders (payload) {
  return {
    type: ORDERS,
    payload
  }
}

export function setOrderbook (payload) {
  return {
    type: ORDERBOOK,
    payload
  }
}

export function setWallet (payload) {
  return {
    type: WALLET,
    payload
  }
}
