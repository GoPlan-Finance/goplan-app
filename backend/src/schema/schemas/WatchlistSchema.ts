import { requiresAuthentication, schema } from './base/defaults'


export default schema('Watchlist', {
  fields: {
    name      : {type: 'String'},
    createdBy : {type: 'Pointer', targetClass: '_User'},
  },
  indexes: {
    name: {name: 1},
  },
  classLevelPermissions: {
    ...requiresAuthentication([
      'find', 'get', 'update', 'create', 'delete',
    ]),
  },
})
