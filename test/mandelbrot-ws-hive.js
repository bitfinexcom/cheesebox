/* eslint-env mocha */

'use strict'
const assert = require('assert')

const MWsHive = require('../src/adapters/mandelbrot-ws-hive.js')
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
      msg = JSON.parse(msg)

      assert.equal(msg.event, 'subscribe')
      wss.send(ws, {ok: true})
    }

    wss.closeHook = (ws) => {
      wss.close()
    }

    const conf = { wsServer: 'ws://localhost:8888' }
    const ws = new MWsHive(conf)

    ws.on('open', () => {
      const msg = JSON.stringify({
        event: 'subscribe',
        channel: 'book',
        symbol: 'BTCUSD'
      })

      ws.send(msg)
    })

    ws.on('close', () => {
      assert.equal(ws.connected, false)
      done()
    })

    ws.on('message', (msg) => {
      assert.deepEqual(JSON.parse(msg.data), { ok: true })
      ws.close()
    })

    ws.open()
  })
})
