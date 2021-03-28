/**
 *
 *
 *
 *
 */

import express from 'express'

import {ParseServer} from 'parse-server'

import liveQueryClassNames from './cloud/liveQuery'

import {createServer} from 'http'
import {makeSchemas} from './schema'


import config from './config'

// Load environment dependent configuration
//const env = config.get('env');

import defaultConfig from '../config/config.defaults'
import userConfig from '../config/config'
import {ProviderConfigInterface} from './cloud/DataProviders/providers'

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


const args     = process.argv || []
const test     = args.some(arg => arg.includes('jasmine'))
process.env.TZ = 'America/New_York' // here is the magical line


if (!config.get('parse.masterKey')) {
  console.error('parse.masterKey not specified')
  process.exit(-1)
}

const parseConfig = {
  auth: {
    google: {
      clientId: config.get('parse.auth.google.clientId') as string
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
  }
}

// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

const app = express()

// Serve static assets from the /public folder
// app.use('/public', express.static(path.join(__dirname, '/public')))

// Serve the Parse API on the /parse URL prefix
if (!test) {
  const api = new ParseServer(parseConfig)

  app.use(config.get('parse.mountPath'), api)
}

// Parse Server plays nicely with the rest of your web routes
app.get('/', function (req, res) {
  res.status(200).send('I dream of being a website.  Please star the GoPlan-Finance repo on GitHub!')
})

const port = config.get('parse.port')
if (!test) {
  const httpServer = createServer(app)
  httpServer.listen(port, function () {
    console.log(`GoPlan running on port ${port}.`)
  })
  // This will enable the Live Query real-time server
  ParseServer.createLiveQueryServer(httpServer)
}

module.exports = {
  app,
  config,
}
