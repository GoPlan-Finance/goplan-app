import {requiresAuthentication, schema} from './base/defaults'


export const AssetSymbol = schema('AssetSymbol', {
  fields: {
    name             : {type: 'String'},
    symbol           : {type: 'String'},
    dataProviderName : {type: 'String'},
    exchange         : {type: 'Pointer', targetClass: 'StockExchange'},
  },
  indexes: {
    symbol: {symbol: 1}
  },
  classLevelPermissions: {
    ...requiresAuthentication([
      'find', 'get', 'count'
    ]),
  },
})
