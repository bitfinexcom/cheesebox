'use strict'

const MB = require('mandelbrot')

class Orders extends MB.BaseOrders {
  constructor (opts = {}) {
    super(opts)

    this.conf = opts

    const { keyed } = this.conf
    this.state = keyed ? { asks: [], bids: [] } : []
  }

  deleteFromKeyed (update) {
    const [ uId ] = update

    this.state = this.state.filter((el) => {
      return uId !== el.id
    })
  }

  deleteFromRaw (update) {
    const [ uId ] = update

    this.state = this.state.filter((el) => {
      return uId !== el[0]
    })
  }

  applyDelete (update) {
    const { keyed } = this.conf

    if (!keyed) return this.deleteFromRaw(update)

    this.deleteFromKeyed(update)
  }

  applyUpdateSnapKeyed (update) {
    const parsed = this.getKeyedFromArray(update)

    const uId = parsed.id

    let found = false
    this.state = this.state.map((el) => {
      const { id } = el

      if (uId !== id) return el

      found = true

      return parsed
    })

    if (!found) {
      this.state.push(parsed)
    }
  }

  applyUpdateSnapList (update) {
    const [ uId ] = update

    let found = false
    this.state = this.state.map((el) => {
      const [ id ] = el

      if (uId !== id) return el
      found = true

      return update
    })

    if (!found) {
      this.state.push(update)
    }
  }

  getKeyedFromArray (el) {
    return {
      id: el[0],
      gid: el[1],
      cid: el[2],
      symbol: el[3],
      created: el[4],
      updated: el[5],
      amount: el[6],
      origAmount: el[7],
      type: el[8],
      flags: el[12],
      status: el[13],
      price: el[16]
    }
  }
}

module.exports = Orders
