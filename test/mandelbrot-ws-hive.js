/* eslint-env mocha */

'use strict'
const assert = require('assert')

const MWsHive = require('../src/adapters/hive-ws.js')
const Wock = require('./ws-testhelper.js')

describe('websockets', () => {
  it('connects and disconnects, sends messages', (done) => {
    // tests basic functions:
    // 1. connect to server
    // 2. send message
    // 3. receive response
    // 4. close connection

    const wss = new Wock({
      port: 8888
    })

    wss.messageHook = (ws, msg) => {
      assert.strictEqual(msg.event, 'subscribe')
      wss.send(ws, { ok: true })
    }

    wss.closeHook = (ws) => {
      wss.close()
    }

    const conf = {
      url: 'ws://localhost:8888',
      user: { id: 1 },
      managedState: {
        Wallet: {},
        Orderbook: { opts: { keyed: true } },
        Orders: {},
        Positions: {}
      }
    }

    const ws = new MWsHive(conf)

    ws.on('open', () => {
      const msg = {
        event: 'subscribe',
        channel: 'book',
        symbol: 'BTCUSD'
      }

      ws.send(msg)
    })

    ws.on('close', () => {
      assert.strictEqual(ws.connected, false)
      done()
    })

    ws.on('message', (msg) => {
      assert.deepStrictEqual(msg, { ok: true })
      ws.close()
    })

    ws.open()
  })
})
