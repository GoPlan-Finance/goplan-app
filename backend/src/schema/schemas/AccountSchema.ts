import { requiresAuthentication, schema } from './base/defaults'


export default schema('Account', {
  fields: {
    createdBy : {type: 'Pointer', targetClass: '_User'},
    name      : {type: 'Object'},
    currency  : {type: 'String'},
  },
  indexes: {
    name: {name: 1},
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
