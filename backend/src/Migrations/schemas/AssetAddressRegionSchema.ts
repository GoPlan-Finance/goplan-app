import { SchemaMigrations } from 'parse-server'


export default SchemaMigrations.makeSchema('AssetAddressRegion', {
  fields: {
    // parentRegion: {type: 'Pointer', targetClass: 'AssetAddressRegion', required: false},

    country : {type: 'String'},
    state   : {type: 'String'},
  },
  indexes: {
    country : {country: 1},
    state   : {state: 1},
  },
  classLevelPermissions: {
    ...SchemaMigrations.CLPHelper.requiresAuthentication([
      'find', 'get', 'count',
    ]),
  },
})
