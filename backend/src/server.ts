/**
 *
 *
 *
 *
 */

import * as express from 'express'
import * as fs from 'fs'
import * as http from 'http'
import * as https from 'https'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ParseServer } from 'parse-server'
import userConfig from '../config/config'

// Load environment dependent configuration
//const env = config.get('env');
import defaultConfig from '../config/config.defaults'
import { ProviderConfigInterface } from './cloud/DataProviders/providers'

import liveQueryClassNames from './cloud/liveQuery'


import config from './config'
import { makeSchemas } from './schema'


config.load({
  ...defaultConfig,
  ...userConfig,
})

// Perform validation
config.validate({allowed: 'strict'})

// @todo, ok ok :)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
global.weHateGlobals_dataProviders = config.get('dataProviders') as ProviderConfigInterface[]


process.env.TZ = 'America/New_York' // here is the magical line


if (!config.get('parse.masterKey')) {
  console.error('parse.masterKey not specified')
  process.exit(-1)
}

const parseConfig = {
  auth: {
    google: {
      clientId: config.get('parse.auth.google.clientId') as string,
    },
  },
  allowClientClassCreation : false,
  databaseURI              : config.get('parse.databaseUri'),
  cloud                    : `${__dirname}/cloud/main.js`,
  appId                    : config.get('parse.appId'),
  masterKey                : config.get('parse.masterKey') as string,
  serverURL                : config.get('parse.serverUrl'), // Don't forget to change to https if needed
  liveQuery                : {
    classNames: liveQueryClassNames, // List of classes to support for query subscriptions
  },
  serverStartComplete: async () => {

    console.log('Running Migrations')
    await makeSchemas()
    console.log('Running Migrations ... Done')
  },
}

// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

const app = express()

// Serve static assets from the /public folder
// app.use('/public', express.static(path.join(__dirname, '/public')))

const api = new ParseServer(parseConfig)

// Parse Server plays nicely with the rest of your web routes
app.get('/', function (req, res) {
  res.status(200).send('I dream of being a website.  Please star the GoPlan-Finance repo on GitHub!')
})

function runParse (api : ParseServer, server : http.Server | https.Server, port : number, mountPath : string) : void {

  const httpServer = http.createServer(app)

  app.use(mountPath, api)

  httpServer.listen(port, function () {
    console.log(`GoPlan running on port ${port}.`)
  })

  // This will enable the Live Query real-time server
  ParseServer.createLiveQueryServer(httpServer)
}


const isHTTP  = config.get('server.http.enabled')
const isHTTPS = config.get('server.https.enabled')

const httpsServer = null

if (isHTTPS) {


  const cert = config.get('server.https.cert') as string
  const key  = config.get('server.https.key') as string

  if (!cert) {
    console.error('"server.https.cert" missing')
    process.exit(-1)
  }
  if (!key) {
    console.error('"server.https.key" missing')
    process.exit(-1)
  }

  const privateKey  = fs.readFileSync(key, 'utf8')
  const certificate = fs.readFileSync(cert, 'utf8')

  const credentials = {key: privateKey, cert: certificate}

  runParse(
    api,
    https.createServer(credentials, app),
    config.get('server.https.port'),
    config.get('server.https.mountPath'),
  )

}

if (isHTTP) {
  runParse(
    api,
    http.createServer(app),
    config.get('server.http.port'),
    config.get('server.http.mountPath'),
  )
}


module.exports = {
  app,
  config,
}
