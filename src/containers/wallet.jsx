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

  _sub () {
    const { dispatch } = this.props

    this.client.onManagedWalletUpdate({}, (res) => {
      dispatch(setWallet(res))
    })

    this.client.auth()
  }

  componentDidMount () {
    this.client.once('open', () => {
      this._sub()
    })
  }

  componentWillUnmount () {
    this.client.unSubscribeWallet()
  }

  render () {
    const {
      error = null,
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
      error = null
    } = this.props

    if (error) {
      return <ErrorBox error={error.message} />
    }

    return (
      <div className='wallet__internal column column-25'>
        <div><strong>Wallet</strong></div>
        {
          wallet.map((el, i) => {
            const [, currency, amount] = el
            return (
              <div className='wallet__internal__item' key={i}>
                <div className='wallet__internal__currency'>{currency}</div>
                <div className='wallet__internal__balance'>{amount}</div>
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
