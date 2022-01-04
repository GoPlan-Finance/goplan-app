/**
 *
 *
 *
 *
 */
export default {
  env    : 'development',
  server : {
    http: {
      enabled : true,
      port    : 1337,
    },
  },

  parse: {
    masterKey   : 'yourMasterKey', // Can be any arbitrary string
    databaseUri : 'mongodb://localhost:27017' // Change this for your mongodb instance uri
  },

  dataProviders: [
    {
      name   : 'eod',
      apiKey : '', // Receive an API Key from https://eodhistoricaldata.com
    },
  ]
}
