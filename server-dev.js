'use strict'

/*
|--------------------------------------------------------------------------
| Http server
|--------------------------------------------------------------------------
|
| This file bootstraps Adonisjs to start the HTTP server. You are free to
| customize the process of booting the http server.
|
| """ Loading ace commands """
|     At times you may want to load ace commands when starting the HTTP server.
|     Same can be done by chaining `loadCommands()` method after
|
| """ Preloading files """
|     Also you can preload files by calling `preLoad('path/to/file')` method.
|     Make sure to pass a relative path from the project root.
*/
const cluster = require('cluster')

if (cluster.isMaster) {
  for (let i=0; i < 4; i ++) {
    cluster.fork()
  }
  require('@adonisjs/websocket/clusterPubSub')()
  return
}

const { Ignitor } = require('@adonisjs/ignitor')

const path = require('path')
const https = require('https')
const fs = require('fs')

// Certificate
const options = {
  key: fs.readFileSync(path.join(__dirname, './dev/ssl/localhost.key')),
  cert: fs.readFileSync(path.join(__dirname, './dev/ssl/localhost.crt'))
}

new Ignitor(require('@adonisjs/fold'))
  .appRoot(__dirname)
  .wsServer()
  .fireHttpServer((handler) => {
    return https.createServer(options, handler)
  })
  .catch(console.error)