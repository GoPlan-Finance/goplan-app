import { SchemaMigrations } from 'parse-server';

export default SchemaMigrations.makeSchema('AssetIndustry', {
  fields: {
    name: { type: 'String' },
  },
  indexes: {
    name: { name: 1 },
  },
  classLevelPermissions: {
    ...SchemaMigrations.CLP.allow({
      requiresAuthentication: ['find', 'get', 'count'],
    }),
  },
});
