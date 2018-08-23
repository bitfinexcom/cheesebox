'use strict'

const MB = require('./mandelbrot-ws-base.js')
const WebSocket = require('isomorphic-ws')

class MandelbrotHive extends MB {
  constructor (conf = {}) {
    super(conf)

    this.conf = conf

    this.wsServer = conf.wsServer
  }

  open () {
    const ws = this.ws = new WebSocket(this.wsServer, {})

    ws.onerror = (err) => {
      this.emit('error', err)
    }

    ws.onopen = () => {
      this.connected = true
      this.emit('open')
    }

    ws.onclose = () => {
      this.connected = false
      this.emit('close')
    }

    ws.onmessage = (msg) => {
      this.emit('message', msg)
      this.handleMessage(msg)
    }
  }

  close () {
    this.ws.close()
  }

  send (msg) {
    this.ws.send(JSON.stringify(msg))
  }

  handleMessage () {

  }
}

module.exports = MandelbrotHive
