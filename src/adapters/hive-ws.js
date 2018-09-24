'use strict'

const MB = require('mandelbrot').WsBase

const Wallet = require('./hive-managed-wallet.js')
const Orderbook = require('./hive-managed-ob.js')

class HiveAdapter extends MB {
  constructor (opts) {
    const { managedState } = opts

    opts.Wallet = Wallet || managedState.Wallet.component

    opts.Orderbook = Orderbook
    opts.Orders = class Orders {}

    opts.transform = {
      orderbook: { keyed: true },
      wallet: managedState.Wallet.opts,
      orders: { keyed: true }
    }

    super(opts)
  }

  auth () {
    const { id } = this.conf.user

    const payload = { event: 'auth', id }
    this.send(payload)
  }

  subscribeWallet () {}

  unSubscribeWallet () {}

  async cancel (data) {}

  place (order) {
    order.type = order.type.replace(/_/g, ' ')
    const on = [
      0,
      'on',
      null,
      order
    ]

    this.send(on)
  }
}

module.exports = HiveAdapter
