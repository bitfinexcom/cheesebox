'use strict'

class Positions {
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

  update (u) {
    const copy = JSON.parse(JSON.stringify(u))

    if (this.isSnapshot(copy)) {
      this.setSnapshot(copy[2])
      return
    }

    this.applyUpdate(copy)
  }

  isSnapshot (u) {
    const [, type] = u
    if (type === 'ps') return true

    return false
  }

  setSnapshot (snap) {
    this.state = snap
  }

  applyUpdate (msg) {
    const [, type, position] = msg
    const [pair] = position

    if (type === 'pc') {
      this.state = this.state.filter((el) => {
        return pair !== el[0]
      })
    }

    if (type === 'pn') {
      this.state.push(position)
      return
    }

    // pu
    this.state = this.state.map((el) => {
      if (el[0] === pair) {
        return position
      }

      return el
    })
  }

  getState () {
    return this.state
  }
}

module.exports = Positions
