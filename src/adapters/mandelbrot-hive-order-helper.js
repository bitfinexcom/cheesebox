'use strict'

const _ = require('lodash')

const template = {
  'id': 9805964569,
  'type': 'EXCHANGE LIMIT',
  'pair': 'BTCUSD',
  'status': 'ACTIVE',
  'created_at': '2018-01-09T11:50:18.330Z',
  'updated_at': '2018-01-09T11:50:18.330Z',
  'user_id': 1,
  'amount': '-15.7',
  'price': '10',
  'amount_orig': '-15.7',
  'routing': '',
  'price_trailing': '0.0',
  'hidden': false,
  'vir': 1,
  'swap_rate_max': '0.0075',
  'placed_id': null,
  'placed_trades': null,
  'nopayback': null,
  'price_avg': '0.0',
  'active': 2,
  'fiat_currency': 'USD',
  'cid': 42618293841,
  'cid_date': '2018-01-09',
  'mseq': 0,
  'gid': null,
  'flags': 0,
  'price_aux_limit': '0.0',
  'type_prev': null,
  'tif': null,
  'v_pair': 'BTCUSD',
  'lcy_post_only': 0
}

function getOrder (data) {
  const {
    postOnly,
    id,
    type,
    user_id,
    amount,
    price,
    pair
  } = data

  const o = {
    id: id || Math.floor(Math.random() * 10000000000),
    type: type,
    lcy_post_only: postOnly,
    user_id: user_id,
    amount,
    amount_orig: amount,
    price,
    v_pair: pair,
    pair: pair
  }

  const res = _.extend({}, template, o)

  return res
}

module.exports = getOrder
