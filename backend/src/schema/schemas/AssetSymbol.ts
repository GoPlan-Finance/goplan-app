import {requiresAuthentication, schema} from './base/defaults'


export default schema('AssetSymbol', {
  fields: {
    name             : {type: 'String'},
    symbol           : {type: 'String'},
    dataProviderName : {type: 'String'},
    currency         : {type: 'String'},
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
