'use strict'

const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')
const browserify = require('browserify')
const async = require('async')

const tasks = [
  copy,
  jsx,
  serve
]

async.series(tasks, (err) => {
  if (err) throw err
})

function jsx (cb) {
  const src = path.join(__dirname, 'src', 'app-eosfinex.jsx')
  const target = fs.createWriteStream(path.join(__dirname, 'build', 'app.js'))
  browserify([ require.resolve('eosjs'), require.resolve('sunbeam'), src ])
    .transform('babelify', {
      presets: [
        '@babel/preset-env',
        [ '@babel/preset-react', {} ]
      ]
    })
    .bundle()
    .pipe(target)
    .on('finish', () => {
      cb(null)
    })
}

function copy (cb) {
  function _copy (name, t, cb) {
    if (fs.existsSync(t)) {
      return cb(null)
    }

    const target = fs.createWriteStream(t)
    fs.createReadStream(require.resolve(name))
      .pipe(target)
      .on('finish', cb)
  }

  const copyTasks = [
    (cb) => {
      const target = path.join(__dirname, 'deps', 'normalize.css')
      return _copy('normalize.css', target, cb)
    },
    (cb) => {
      const target = path.join(__dirname, 'deps', 'milligram.css')
      return _copy('milligram', target, cb)
    }
  ]

  async.parallel(copyTasks, (err) => {
    if (err) throw err
    cb(null)
  })
}

function serve () {
  app.use(
    express.static(__dirname, {
      index: [ 'index.html' ],
      extensions: [ 'html' ]
    })
  )

  app.use(
    '/app.css',
    express.static(path.join(__dirname, 'app.css'))
  )

  const port = 1338
  app.listen(port, () => {
    console.log(`listening on port ${port}!`)
    console.log(`http://localhost:${port}`)
  })
}
