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
    masterKey   : '',
    databaseUri : ''
  },

  dataProviders: [
    {
      name   : 'fmp',
      apiKey : '',
    },
    {
      name   : 'yahoo',
      apiKey : '',
    }

  ]
}
