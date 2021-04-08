import {requiresAuthentication, schema} from './base/defaults'


export default schema('AssetAddressRegion', {
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
    ...requiresAuthentication([
      'find', 'get', 'count'
    ]),
  },
})
