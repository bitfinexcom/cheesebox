'use strict'

import React, { Component } from 'react'

const Row = (props) => {
  const {
    data: {
      id,
      price,
      amount,
      belongsToUser
      // type
    },
    cancelcb, // false for order book, function for positions
    side,
    data
  } = props

  // display either a small circle to indicate that the order belongs to the user
  // or a cancel button, in case the row is used in the positions component
  // does nto display any button or indicator if just an order book entry, belonging to another user
  let lastElement = (
    <div className='row__cancelbutton'>
      <div className='row__cancelbutton__el'>
        { belongsToUser ? <span className='row__cancelbutton__el-red'>o</span> : null }
      </div>
    </div>
  )

  if (cancelcb && belongsToUser) {
    lastElement = (
      <div className='row__cancelbutton row__cancelbutton__el-pointer' onClick={(e) => cancelcb(data)}>
        <div className='row__cancelbutton__el'>X</div>
      </div>
    )
  } else if (cancelcb) {
    lastElement = (
      <div className='row__cancelbutton' />
    )
  }

  return (
    <div className='rowI'>
      <div className='row__price'>
        {price}
      </div>
      <div className='row__quantity'>
        {amount}
      </div>
      {lastElement}
    </div>
  )
}

export default Row
