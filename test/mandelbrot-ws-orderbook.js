/* eslint-env mocha */

'use strict'
const assert = require('assert')

const MWsHive = require('../src/adapters/hive-ws.js')
const Wallet = require('../src/adapters/hive-managed-wallet.js')
const Orderbook = require('../src/adapters/hive-managed-ob.js')

const Wock = require('./ws-testhelper.js')

describe('websockets', () => {
  it('subscribes to order books', (done) => {
    const wss = new Wock({
      port: 8888
    })

    wss.messageHook = (ws, msg) => {
      if (msg.event === 'subscribe') {
        wss.send(ws, {
          event: 'subscribed',
          channel: 'book',
          chanId: '123btcusd',
          symbol: 'BTCUSD'
        })
      }

      setTimeout(() => {
        // simulate ob snapshot
        wss.send(ws, [
          '123btcusd',
          [
            [ -16.1, 1, 1 ],
            [ -8.99, 3, 12 ]
          ]
        ])
      }, 50)

      setTimeout(() => {
        wss.send(ws, [
          '123btcusd',
          [ [ 1, 1, 1 ] ]
        ])
      }, 100)
    }

    wss.closeHook = (ws) => {
      wss.close()
    }

    const conf = {
      url: 'ws://localhost:8888',
      user: { id: 1 },
      managedState: {
        Wallet: { Component: Wallet },
        Orderbook: { Component: Orderbook, opts: { keyed: false } }
      }
    }
    const ws = new MWsHive(conf)

    ws.on('open', () => {
      ws.subscribeOrderBook('BTCUSD')
    })

    ws.on('close', () => {
      assert.strictEqual(ws.connected, false)
      done()
    })

    let count = 0
    ws.onOrderBook({ symbol: 'BTCUSD' }, (ob) => {
      if (count === 1) {
        assert.deepStrictEqual(ob, [ [ 1, 1, 1 ] ])
        count++
      }

      if (count === 0) {
        assert.deepStrictEqual(ob, [ [ -16.1, 1, 1 ], [ -8.99, 3, 12 ] ])
        count++
      }

      if (count === 2) {
        ws.close()
      }
    })

    ws.open()
  })
})
