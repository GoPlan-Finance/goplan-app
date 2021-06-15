import { SchemaMigrations } from 'parse-server'


export default SchemaMigrations.makeSchema('AssetSector', {
  fields: {
    name: {type: 'String'},
  },
  indexes: {
    name: {name: 1},
  },
  classLevelPermissions: {
    ...SchemaMigrations.CLPHelper.requiresAuthentication([
      'find', 'get', 'count',
    ]),
  },
})
