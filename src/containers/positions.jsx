'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'

import ErrorBox from '../common/errorbox.jsx'

import {
  setPositions
} from '../actions.js'

const TablePositions = (props) => {
  const rows = props.data.map((el, i) => {
    const [symbol, status, amount, basePrice] = el

    return (
      <tr key={i}>
        <td>{symbol}</td>
        <td>{amount}</td>
        <td>{basePrice}</td>
      </tr>
    )
  })

  return (
    <table>
      <thead>
        <tr>
          <td>Pair</td>
          <td>Amount</td>
          <td>Base Price</td>
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </table>
  )
}

class PositionsContainer extends Component {
  constructor (props) {
    super(props)

    this.client = this.props.client
  }

  componentDidMount () {
    this.client.once('open', () => {
      this._sub()
    })
  }

  componentWillUnmount () {
    this.client.onManagedPositionsUpdate({}, (positions) => {})
  }

  _sub () {
    const { dispatch } = this.props

    this.client.onManagedPositionsUpdate({}, (positions) => {

      dispatch(
        setPositions(positions)
      )
    })

    this.client.auth()
  }

  render () {
    const {
      positions = []
    } = this.props

    return (
      <div className='column column-65 column-offset-10 positions'>
        All Positions

        <TablePositions data={positions} />
      </div>
    )
  }
}


function mapStateToProps (state) {
  const {
    pairPairs,
    user,
    positions
  } = state

  return {
    ...pairPairs,
    ...user,
    ...positions
  }
}

export default connect(mapStateToProps)(PositionsContainer)
