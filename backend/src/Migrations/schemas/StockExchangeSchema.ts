import { SchemaMigrations } from 'parse-server'


export default SchemaMigrations.makeSchema('StockExchange', {
  fields: {
    code             : {type: 'String'},
    name             : {type: 'String'},
    country          : {type: 'String'},
    currency         : {type: 'String'},
    dataProviderName : {type: 'String'},
  },
  indexes: {
    code             : {code: 1},
    name             : {name: 1},
    dataProviderName : {dataProviderName: 1},
  },
  classLevelPermissions: {
    ...SchemaMigrations.CLPHelper.requiresAuthentication([
      'find', 'get',
    ]),

    protectedFields: {
      //   '*': [
      //     'name',
      //   ],
    },
  },
})
