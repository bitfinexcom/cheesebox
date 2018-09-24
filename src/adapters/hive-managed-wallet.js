'use strict'

class Wallet {
  constructor (conf = {}) {
    this.state = []

    this.conf = conf
  }

  parse (d) {
    const copy = JSON.parse(JSON.stringify(d))

    if (this.isSnapshot(copy)) {
      return this.parseSnap(copy)
    }

    return this.parseUpdate(copy)
  }

  isSnapshot (u) {
    return true
  }

  parseSnap (snap) {
    return snap
  }

  parseUpdate (update) {
    return update
  }

  update (u) {
    const copy = JSON.parse(JSON.stringify(u))

    if (this.isSnapshot(copy)) {
      this.setSnapshot(copy)
      return
    }

    this.applyUpdate(copy)
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
