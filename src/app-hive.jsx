'use strict'

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import App from './containers/root.jsx'
import configureStore from './configureStore.js'

import HiveConnector from './adapters/mandelbrot-hive.js'

const user = { id: 1, name: 'testuser' }

const mb = new HiveConnector({
  endpoint: 'http://localhost:8000/gateway',
  user: user
})

const conf = {
  dev: true,
  user: user,
  exchangeName: 'Cantor Exchange - Hive',
  pair: 'BTCUSD',
  pairs: [
    'BTCUSD',
    'ETHUSD'
  ],
  client: mb
}

const store = configureStore()

ReactDOM.render((
  <Provider store={store}>
    <App conf={conf} />
  </Provider>
), document.getElementById('root'))
