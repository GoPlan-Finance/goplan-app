import { SchemaMigrations } from 'parse-server'


export default SchemaMigrations.makeSchema('Account', {
  fields: {
    createdBy : {type: 'Pointer', targetClass: '_User'},
    name      : {type: 'Object'},
    currency  : {type: 'String'},
  },
  indexes: {
    name: {name: 1},
  },
  classLevelPermissions: {
    ...SchemaMigrations.CLPHelper.requiresAuthentication([
      'find', 'get', 'count', 'update', 'create', 'delete',
    ]),

    protectedFields: {
      // '*': [
      //     'symbol',
      // ],
    },
  },
})
