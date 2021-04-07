import {requiresAuthentication, schema} from './base/defaults'

export default schema('Transaction', {
  fields: {
    createdBy  : {type: 'Pointer', targetClass: '_User'},
    symbol     : {type: 'Pointer', targetClass: 'AssetSymbol', required: true},
    executedAt : { type: 'Date', required: true},
    price      : { type: 'Object', required: true},
    currency   : {type: 'String'},
    quantity   : { type: 'Object', required: true},
    type       : { type: 'Object', required: true},
  },
  indexes: {
  },
  classLevelPermissions: {
    ...requiresAuthentication([
      'find', 'get', 'update', 'create', 'delete'
    ]),

    protectedFields: {
      // '*': [
      //     'symbol',
      // ],
    },
  },
})
