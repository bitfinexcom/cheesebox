/* eslint-env mocha */

'use strict'
const assert = require('assert')

const Orders = require('../src/adapters/hive-managed-orders.js')

describe('managed component', () => {
  const snapMsg = [
    '0',
    'os',
    [
      [7821491314, null, null, 'BTCUSD', 1515498618330, 1515498618330, '-1.0', '-1.0', 'EXCHANGE LIMIT', null, null, null, 0, 'ACTIVE', null, null, '2.2', '0.0', null, null, null, null, null, null, null, null],
      [2779472089, null, null, 'BTCUSD', 1515498618330, 1515498618330, '-0.3', '-0.3', 'EXCHANGE LIMIT', null, null, null, 0, 'ACTIVE', null, null, '2.3', '0.0', null, null, null, null, null, null, null, null]
    ]
  ]

  const emptySnapMsg = [
    '0',
    'os',
    []
  ]

  const onMsg = [
    '0',
    'on',
    [6779421927, null, null, 'BTCUSD', 1515498618330, 1515498618330, '1.0', '1.0', 'EXCHANGE LIMIT', null, null, null, 0, 'ACTIVE', null, null, '1.0', '0.0', null, null, null, null, null, null, null, null]
  ]

  const ocMsg = [
    '0',
    'oc',
    [2779472089, null, null, 'BTCUSD', 1515498618330, 1515498618330, '-0.3', '-0.3', 'EXCHANGE LIMIT', null, null, null, 0, 'ACTIVE', null, null, '2.3', '0.0', null, null, null, null, null, null, null, null]
  ]

  describe('orders helper', () => {
    it('takes snapshots', () => {
      const o = new Orders()

      o.update(snapMsg)

      assert.strictEqual(7821491314, o.getState()[0][0])
      assert.deepStrictEqual(o.getState(), snapMsg[2])
    })

    it('takes empty snapshots', () => {
      const o = new Orders()

      o.update(emptySnapMsg)

      assert.deepStrictEqual(o.getState(), [])
    })

    it('update on - new order', () => {
      const o = new Orders()
      const snap = snapMsg[2]

      o.update(snapMsg)
      o.update(onMsg)

      assert.deepStrictEqual(o.getState(), [ snap[0], snap[1], onMsg[2] ])
    })

    it('update oc - delete order', () => {
      const o = new Orders()
      const snap = snapMsg[2]
      o.update(snapMsg)
      o.update(onMsg)

      assert.deepStrictEqual(o.getState(), [ snap[0], snap[1], onMsg[2] ])

      o.update(ocMsg)
      assert.deepStrictEqual(o.getState(), [ snap[0], onMsg[2] ])
    })

    it('supports keyed format, snaps', () => {
      const o = new Orders({ keyed: true })
      o.update(snapMsg)

      const exp = {
        amount: '-1.0',
        cid: null,
        created: 1515498618330,
        flags: 0,
        gid: null,
        id: 7821491314,
        origAmount: '-1.0',
        price: '2.2',
        status: 'ACTIVE',
        symbol: 'BTCUSD',
        type: 'EXCHANGE LIMIT',
        updated: 1515498618330
      }

      assert.deepStrictEqual(o.getState()[0], exp)
    })

    it('supports keyed format, new order', () => {
      const o = new Orders({ keyed: true })
      o.update(snapMsg)

      o.update(onMsg)

      assert.strictEqual(o.getState().length, 3)
      const exp = {
        amount: '1.0',
        cid: null,
        created: 1515498618330,
        flags: 0,
        gid: null,
        id: 6779421927,
        origAmount: '1.0',
        price: '1.0',
        status: 'ACTIVE',
        symbol: 'BTCUSD',
        type: 'EXCHANGE LIMIT',
        updated: 1515498618330
      }

      assert.deepStrictEqual(o.getState()[2], exp)
    })

    it('supports keyed format, cancel order', () => {
      const o = new Orders({ keyed: true })
      o.update(snapMsg)
      o.update(onMsg)
      assert.strictEqual(o.getState().length, 3)

      o.update(ocMsg)

      const res = o.getState()
      assert.strictEqual(res.length, 2)

      assert.deepStrictEqual(
        [res[0].id, res[1].id],
        [7821491314, 6779421927]
      )
    })
  })
})
