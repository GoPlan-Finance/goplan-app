import { SchemaMigrations } from 'parse-server'


export default SchemaMigrations.makeSchema('Watchlist', {
  fields: {
    name      : {type: 'String'},
    createdBy : {type: 'Pointer', targetClass: '_User'},
  },
  indexes: {
    name: {name: 1},
  },
  classLevelPermissions: {
    ...SchemaMigrations.CLPHelper.requiresAuthentication([
      'find', 'get', 'update', 'create', 'delete',
    ]),
  },
})
