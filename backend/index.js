/**
 *
 *
 *
 *
 */

const express     = require('express')
const ParseServer = require('parse-server').ParseServer
const args        = process.argv || []
const test        = args.some(arg => arg.includes('jasmine'))

const liveQueryClassNames = require('./cloud/liveQuery.js')

const databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.')
}

if (!process.env.SERVER_URL) {
  console.log('SERVER_URL not specified, falling back to localhost.')
}

if (!process.env.MASTER_KEY) {
  console.log('MASTER_KEY not specified')
  process.exit(-1)
}

const config = {
  databaseURI : databaseUri || 'mongodb://localhost:27017/dev',
  cloud       : `${__dirname  }/cloud/main.js`,
  appId       : 'GoPlan-Finance',
  masterKey   : process.env.MASTER_KEY || '', //Add your master key here. Keep it secret!
  serverURL   : process.env.SERVER_URL || 'http://localhost:1337/parse', // Don't forget to change to https if needed
  liveQuery   : {
    classNames: liveQueryClassNames, // List of classes to support for query subscriptions
  },
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
  const httpServer = require('http').createServer(app)
  httpServer.listen(port, function () {
    console.log(`GoPlan running on port ${  port  }.`)
  })
  // This will enable the Live Query real-time server
  ParseServer.createLiveQueryServer(httpServer)
}

module.exports = {
  app,
  config,
}
