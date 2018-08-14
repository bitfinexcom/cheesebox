'use strict'

import React, { Component } from 'react'

const ErrorBox = (props) => {
  return (
    <div className='error'>
      Error: {props.error}
    </div>
  )
}

export default ErrorBox
