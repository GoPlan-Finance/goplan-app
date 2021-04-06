import {requiresAuthentication, schema} from './base/defaults'

export const StockExchange = schema('StockExchange', {
  fields: {
    name: {type: 'String'},
  },
  indexes: {
    name: {name: 1},
  },
  classLevelPermissions: {
    ...requiresAuthentication([
      'find', 'get'
    ]),

    protectedFields: {
      '*': [
        'name',
      ],
    },
  },
})
