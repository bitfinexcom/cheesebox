'use strict'

const EventEmitter = require('events')

class MB extends EventEmitter {
  constructor (conf = {}) {
    super(conf)

    this.conf = conf
  }

  orderbook (q, opts = {}) {
    throw new Error('not implemented')
  }

  orders (q, opts = {}) {
    throw new Error('not implemented')
  }

  wallet (q, opts = {}) {
    throw new Error('not implemented')
  }

  getOrder (data) {
    throw new Error('not implemented')
  }

  send (payload, p = '', opts = {}) {
    throw new Error('not implemented')
  }

  place (q) {
    throw new Error('not implemented')
  }

  cancel (q) {
    throw new Error('not implemented')
  }
}

module.exports = MB
