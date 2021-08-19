import { requiresAuthentication, schema } from './base/defaults'


export default schema('HoldingTimeSeries', {
  fields: {
    holding  : {type: 'Pointer', targetClass: 'Holding', required: true},
    currency : {type: 'String'},

    isOutdated: {type: 'Boolean', defaultValue: true},

    startAt : {type: 'Date'},
    period  : {type: 'String'},

    openQty : {type: 'Object'},
    open    : {type: 'Object'},
    close   : {type: 'Object'},
    low     : {type: 'Object'},
    high    : {type: 'Object'},
  },
  indexes: {
    isOutdated : {isOutdated: 1},
    holding    : {holding: 1},
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
