'use strict'

// P0
// PRICE, COUNT, AMOUNT

class Orderbook {
  constructor (opts = {}) {
    this.conf = opts

    const { keyed } = this.conf
    this.state = keyed ? { asks: [], bids: [] } : []

    this.type = 'P0'
  }

  isSnapshot (d) {
    return true
  }

  parse (d) {
    const copy = JSON.parse(JSON.stringify(d))

    if (this.isSnapshot(copy)) {
      return this.parseSnap(copy)
    }

    return this.parseUpdate(copy)
  }

  update (d) {
    const copy = JSON.parse(JSON.stringify(d))

    if (this.isSnapshot(copy)) {
      this.setSnapshot(copy)
      return
    }

    this.applyUpdate(copy)
  }

  setSnapshot (snap) {
    this.state = this.parseSnap(snap)
  }

  deleteFromKeyed (id, state) {
    throw new Error('not implemented')
  }

  deleteFromRaw (id, state) {
    throw new Error('not implemented')
  }

  applyDelete (id, state, keyed) {
    if (keyed) {
      return this.deleteFromKeyed(id, state)
    }

    return this.deleteFromRaw(id, state)
  }

  deleteEntry (id) {
    const { keyed } = this.conf
    this.state = this.applyDelete(id, this.state, keyed)
  }

  applyUpdate (update) {
    throw new Error('not implemented')
  }

  parseUpdate (el) {
    throw new Error('not implemented')
  }

  parseSnap (snap) {
    const { decimals, keyed } = this.conf
    const dt = this.decimalsTransformer

    // raw
    if (!keyed && !decimals) {
      return snap
    }

    if (decimals) {
      snap = snap.map((el) => {
        const [price, count, amount] = el
        return [dt(price, decimals), count, dt(amount, decimals)]
      })
    }

    if (!keyed) {
      return snap
    }

    const keyedSnap = this.getKeyedSnap(snap)
    return keyedSnap
  }

  getKeyedSnap (snap) {
    const asks = snap.filter(el => el[2] > 0)
    const bids = snap.filter(el => el[2] < 0)

    const mp = (el) => {
      const order = {
        price: el[0],
        count: el[1],
        amount: el[2]
      }

      return order
    }

    const ob = {
      asks: bids.map(mp).sort((a, b) => a.price - b.price),
      bids: asks.map(mp).sort((a, b) => b.price - a.price)
    }

    return ob
  }

  getState () {
    return this.state
  }

  decimalsTransformer (el, decimals) {
    return el / 10 ** decimals
  }
}

module.exports = Orderbook
