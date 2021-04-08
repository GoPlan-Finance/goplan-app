import { requiresAuthentication, schema } from './base/defaults'


export default schema('Transaction', {
  fields: {
    createdBy          : {type: 'Pointer', targetClass: '_User'},
    account            : {type: 'Pointer', targetClass: 'Account', required: true},
    symbol             : {type: 'Pointer', targetClass: 'AssetSymbol', required: false},
    executedAt         : {type: 'Date', required: true},
    price              : {type: 'Object'},
    currency           : {type: 'String'},
    quantity           : {type: 'Object'},
    fees               : {type: 'Object'},
    totalExcludingFees : {type: 'Object'},
    type               : {type: 'Object', required: true},
    importStatus       : {type: 'Object'},
    importRawData      : {type: 'Object'},
  },
  indexes: {
    executedAt : {executedAt: 1},
    symbol     : {symbol: 1},
  },
  classLevelPermissions: {
    ...requiresAuthentication([
      'find', 'get', 'count', 'update', 'create', 'delete',
    ]),

    protectedFields: {
      // '*': [
      //     'symbol',
      // ],
    },
  },
})
