'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'

import OrderbookRow from '../common/book-positions-row.jsx'
import ErrorBox from '../common/errorbox.jsx'

import {
  setPositions
} from '../actions.js'

class PositionsContainer extends Component {
  constructor (props) {
    super(props)

    this.client = this.props.client
  }

  componentDidMount () {
    const { pair } = this.props

    this.client.once('open', () => {
      this._sub(pair)
    })
  }
}
