/**
 *
 *
 *
 *
 */
export default {
  env : 'development',

  server        : {
    http: {
      enabled: false
    },
    https : {
      // enabled: true,
      // cert : `${__dirname}/server.cert`,
      // key : `${__dirname}/server.key`,
    },
  },
  parse         : {
    masterKey   : '',
    databaseUri : '',
  },
  dataProviders : [
    {
      name   : 'fmp',
      apiKey : '',
    },
    {
      name   : 'yahoo',
      apiKey : '',
    },

  ],
}
