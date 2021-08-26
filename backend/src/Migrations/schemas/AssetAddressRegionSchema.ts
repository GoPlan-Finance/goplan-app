import { SchemaMigrations } from 'parse-server';

export default SchemaMigrations.makeSchema('AssetAddressRegion', {
  fields: {
    // parentRegion: {type: 'Pointer', targetClass: 'AssetAddressRegion', required: false},

    country: { type: 'String' },
    state: { type: 'String' },
  },
  indexes: {
    country: { country: 1 },
    state: { state: 1 },
  },
  classLevelPermissions: {
    ...SchemaMigrations.CLP.allow({
      requiresAuthentication: ['find', 'get', 'count'],
    }),
  },
});
