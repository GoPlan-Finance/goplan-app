import { SchemaMigrations } from 'parse-server'


export default SchemaMigrations.makeSchema('_User', {
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
  indexes               : {},
  classLevelPermissions : {
    ...SchemaMigrations.CLPHelper.requiresAuthentication([
      'update',
    ]),

    ...SchemaMigrations.CLPHelper.requiresAnonymous([
      'create',
    ]),

    protectedFields: {
      '*': [
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
