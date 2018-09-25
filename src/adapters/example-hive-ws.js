'use strict'

const HiveConnector = require('./hive-ws.js')

const Orderbook = require('./hive-managed-ob.js')
const Wallet = require('./hive-managed-wallet.js')

const user = { id: 1, name: 'testuser' }

const ws = new HiveConnector({
  url: 'ws://localhost:8888',
  user: user,
  managedState: {
    Wallet: { component: Wallet },
    Orderbook: { component: Orderbook, opts: { keyed: true } }
  }
})

ws.on('message', (m) => {
  console.log(m)
})

ws.on('error', (m) => {
  console.error('ERROR!')
  console.error(m)
})

ws.on('open', () => {
  console.log('open')

  ws.onOrderBook({ symbol: 'BTCUSD' }, (ob) => {
    console.log('ws.onOrderBook({ symbol: "BTCUSD" }')
    console.log(ob)
  })

  ws.onManagedWalletUpdate({}, (ob) => {
    console.log('ws.onManagedWalletUpdate({})')
    console.log(ob)
  })

  ws.subscribeOrderBook('BTCUSD')

  ws.auth()
})

ws.open()
