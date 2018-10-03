'use strict'

const MB = require('mandelbrot').WsBase

const Wallet = require('./hive-managed-wallet.js')
const Orderbook = require('./hive-managed-ob.js')
const Orders = require('./hive-managed-orders.js')

class HiveAdapter extends MB {
  constructor (opts) {
    const { managedState } = opts

    opts.Wallet = managedState.Wallet.component || Wallet
    opts.Orderbook = managedState.Orderbook.component || Orderbook
    opts.Orders = managedState.Orders.component || Orders

    opts.transform = {
      orderbook: managedState.Orderbook.opts,
      wallet: managedState.Wallet.opts,
      orders: managedState.Orders.opts
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
  subscribeTrades (symbol) {}

  cancel (data) {
    const oc = [
      0,
      'oc',
      null,
      {
        id: data.id,
        pair: data.pair
      }
    ]

    this.send(oc)
  }

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
