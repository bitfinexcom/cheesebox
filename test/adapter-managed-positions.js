/* eslint-env mocha */

'use strict'
const assert = require('assert')

const Positions = require('../src/adapters/hive-managed-positions.js')

describe('managed component', () => {
  const snapMsg = [
    '0',
    'ps',
    [
      ['BTCUSD', 'ACTIVE', '-1.0', '1.0', '0', null, null, null, null, null, null],
      ['ETHUSD', 'ACTIVE', '-3.0', '1.0', '0', null, null, null, null, null, null]
    ]
  ]

  const emptySnapMsg = [
    '0',
    'ps',
    []
  ]

  const pnMsg = [
    '0', 'pn', ['EOSUSD', 'ACTIVE', '-1.0', '1.0', '0', null, null, null, null, null, null]
  ]

  const pcMsg = [
    '0', 'pc', ['ETHUSD', 'ACTIVE', '-1.0', '1.0', '0', null, null, null, null, null, null]
  ]

  const puMsg = [
    '0', 'pu', ['ETHUSD', 'ACTIVE', '-2.0', '1.0', '0', null, null, null, null, null, null]
  ]

  it('takes empty snapshots', () => {
    const o = new Positions()

    o.update(emptySnapMsg)

    assert.deepStrictEqual(o.getState(), [])
  })

  it('takes snapshots', () => {
    const o = new Positions()

    o.update(snapMsg)

    assert.deepStrictEqual(o.getState(), snapMsg[2])
  })

  it('update pn - new position', () => {
    const o = new Positions()
    const snap = snapMsg[2]

    o.update(snapMsg)
    o.update(pnMsg)

    assert.deepStrictEqual(o.getState(), [ snap[0], snap[1], pnMsg[2] ])
  })

  it('update pu - update position', () => {
    const o = new Positions()

    o.update(snapMsg)
    o.update(puMsg)

    assert.deepStrictEqual(o.getState()[1], puMsg[2])
  })

  it('update pc - delete position', () => {
    const o = new Positions()
    const snap = snapMsg[2]

    o.update(snapMsg)
    o.update(pcMsg)

    assert.deepStrictEqual(o.getState(), [snap[0]])
  })
})
