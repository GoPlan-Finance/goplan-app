import {requiresAnonymous, requiresAuthentication, schema} from './base/defaults'

export default schema('_User', {
  fields: {
    email         : {type: 'String'},
    authData      : {type: 'Object'},
    emailVerified : {type: 'Boolean'},
    password      : {type: 'String'},
    username      : {type: 'String'},
    // firstname: {type: 'String'},
    // lastname: {type: 'String'},
    profileInfo   : {type: 'Object'},
    clientKey     : {type: 'Object'},
  },
  indexes: {
  },
  classLevelPermissions: {
    ...requiresAuthentication([
      'update'
    ]),

    ...requiresAnonymous([
      'create'
    ]),

    protectedFields: {
      '*': [
        'email',
        'authData',
        'emailVerified',
        'password',
        'username',
        // 'lastname',
        // 'firstname',
      ],
    },
  },
})
