'use strict'

class MB {
  constructor (conf = {}) {
    this.conf = conf
  }

  orderbook (q, opts = {}) {
    throw new Error('not implemented: should return a Promise')
  }

  orders (q, opts = {}) {
    throw new Error('not implemented: should return a Promise')
  }

  wallet (q, opts = {}) {
    throw new Error('not implemented: should return a Promise')
  }

  getOrder (data) {
    throw new Error('not implemented: should return a Promise')
  }

  send (payload, p = '', opts = {}) {
    throw new Error('not implemented: should return a Promise')
  }

  place (q) {
    throw new Error('not implemented: should return a Promise')
  }

  cancel (q) {
    throw new Error('not implemented: should return a Promise')
  }
}

module.exports = MB
