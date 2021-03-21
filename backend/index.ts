/**
 *
 *
 *
 *
 */

import express from 'express'

import { ParseServer } from 'parse-server'

import liveQueryClassNames from './cloud/liveQuery.js'

import { createServer } from 'http'

const args     = process.argv || []
const test     = args.some(arg => arg.includes('jasmine'))
process.env.TZ = 'America/New_York' // here is the magical line

const databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/dev'

if (!databaseUri) {
  console.warn('DATABASE_URI not specified, falling back to localhost.')
}

if (!process.env.SERVER_URL) {
  console.warn('SERVER_URL not specified, falling back to localhost.')
}

if (!process.env.MASTER_KEY) {
  console.error('MASTER_KEY not specified')
  process.exit(-1)
}

const config = {
  auth: {
    google: {},
  },
  allowClientClassCreation : false,
  databaseURI              : databaseUri,
  cloud                    : `${__dirname}/cloud/main.js`,
  appId                    : 'goplan-finance',
  masterKey                : process.env.MASTER_KEY,
  serverURL                : process.env.SERVER_URL || 'http://local.goplan.finance:1337/parse', // Don't forget to change to https if needed
  liveQuery                : {
    classNames: liveQueryClassNames, // List of classes to support for query subscriptions
  },
  serverStartComplete: async () => {

    // @todo run theses ONCE !
    // const { BetterThanNothingMigration } = require('./Migrations/index.ts')
    // await BetterThanNothingMigration.v2021_03_06()
    // await BetterThanNothingMigration.v2021_03_07()

  }
}

// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

const app = express()

// Serve static assets from the /public folder
// app.use('/public', express.static(path.join(__dirname, '/public')))

// Serve the Parse API on the /parse URL prefix
const mountPath = process.env.PARSE_MOUNT || '/parse'
if (!test) {
  const api = new ParseServer(config)

  app.use(mountPath, api)
}

// Parse Server plays nicely with the rest of your web routes
app.get('/', function (req, res) {
  res.status(200).send('I dream of being a website.  Please star the GoPlan-Finance repo on GitHub!')
})

const port = process.env.PORT || 1337
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
