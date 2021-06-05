import { requiresAuthentication, schema } from './base/defaults'


export default schema('AssetSector', {
  fields: {
    name: {type: 'String'},
  },
  indexes: {
    name: {name: 1},
  },
  classLevelPermissions: {
    ...requiresAuthentication([
      'find', 'get', 'count',
    ]),
  },
})
