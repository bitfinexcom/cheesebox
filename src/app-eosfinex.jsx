'use strict'

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import App from './containers/root.jsx'
import configureStore from './configureStore.js'

import EosfinexConnector from './adapters/mandelbrot-eosfinex.js'
import Eos from 'eosjs'

const readNodeConf = {
  httpEndpoint: 'http://localhost:8888',
  keyProvider: [
    '5Kci5UR4h25CM4vCyQMTQy4pzMhqXZ8vnocYJJkm2eQb8cfHsWV'
  ]
}

const writeNodeConf = {
  httpEndpoint: 'http://localhost:8888', // 'http://writenode.example.com'
  keyProvider: [
    '5Kci5UR4h25CM4vCyQMTQy4pzMhqXZ8vnocYJJkm2eQb8cfHsWV'
  ]
}
const eosConf = {
  Eos,
  readNodeConf,
  writeNodeConf
}

const user = { id: null, name: 'testuser4321' }

const sb = new Sunbeam(
  eosConf,
  { account: user.name, dev: true }
)

const mb = new EosfinexConnector({
  sunbeam: sb,
  user: user
})

const conf = {
  dev: true,
  user: user,
  exchangeName: 'Cantor Exchange - eosfinex',
  pair: 'BTC.USD',
  pairs: [
    'BTC.USD',
    'ETH.USD'
  ],
  client: mb
}

const store = configureStore()

ReactDOM.render((
  <Provider store={store}>
    <App conf={conf} />
  </Provider>
), document.getElementById('root'))
