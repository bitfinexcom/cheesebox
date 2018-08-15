'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'

import ErrorBox from '../common/errorbox.jsx'

import {
  setWallet
} from '../actions.js'

class WalletContainer extends Component {
  constructor (props) {
    super(props)

    this.client = this.props.client
  }

  updateInterval () {
    const { dispatch } = this.props

    if (this.periodicFetch) {
      clearInterval(this.periodicFetch)
    }

    this.periodicFetch = setInterval(() => {
      this.client.wallet()
        .then((res) => {
          dispatch(setWallet(res))
        })
        .catch((err) => {
          dispatch(setWallet({ error: err }))
        })
    }, 1000)
  }

  componentWillMount () {
    this.updateInterval()
  }

  componentWillUnmount () {
    clearInterval(this.periodicFetch)
  }

  render () {
    const {
      error,
      wallet = []
    } = this.props

    return (
      <WalletInternal
        wallet={wallet}
        error={error}
        cancelcb={false}
      />
    )
  }
}

class WalletInternal extends Component {
  render () {
    const {
      wallet = [],
      error = false
    } = this.props

    if (error) {
      return <ErrorBox error={error.message} />
    }

    return (
      <div className='wallet__internal column column-25'>
        <div><strong>Wallet</strong></div>
        {
          wallet.map((el, i) => {
            return (
              <div className='wallet__internal__item' key={i}>
                <div className='wallet__internal__currency'>{el.currency}</div>
                <div className='wallet__internal__balance'>{el.balance}</div>
              </div>
            )
          })
        }
      </div>
    )
  }
}

function mapStateToProps (state) {
  const {
    wallet
  } = state

  return {
    ...wallet
  }
}

export default connect(mapStateToProps)(WalletContainer)
