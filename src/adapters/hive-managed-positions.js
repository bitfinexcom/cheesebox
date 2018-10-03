'use strict'

class Wallet {
  constructor (conf = {}) {
    this.state = []

    this.conf = conf
  }

  parse (type, d) {
    const copy = JSON.parse(JSON.stringify(d))

    if (this.isSnapshot(copy, type)) {
      return this.parseSnap(copy)
    }

    return this.parseUpdate(copy)
  }

  update (u, type) {
    const copy = JSON.parse(JSON.stringify(u))

    if (this.isSnapshot(copy, type)) {
      this.setSnapshot(copy)
      return
    }

    this.applyUpdate(copy)
  }

  isSnapshot (u, type) {
    if (type === 'ps') return true

    return false
  }

  parseSnap (snap) {
    return snap
  }

  parseUpdate (update) {
    return update
  }

  setSnapshot (snap) {
    const res = this.parseSnap(snap)

    this.state = res
  }

  applyUpdate (update) {
    throw new Error('not implemented')
  }

  getState () {
    return this.state
  }
}

module.exports = Wallet
