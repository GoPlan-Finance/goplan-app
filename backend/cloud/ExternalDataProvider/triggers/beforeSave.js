/**
 *
 *
 *
 */

// const USE_MASTER_KEY = { useMasterKey: true }
// import { assertEncrypted } from '../../../../common/Auth'


const assertUser = (user) => {
  if (!user) {
    throw new Parse.Error('Please log-in')
  }
}

Parse.Cloud.beforeSave('ExternalDataProvider', async (request) => {
  assertUser(request.user)
  // @todo
  // assertEncrypted(request.object, 'credentials')

  request.object.set('user', request.user)
  request.object.setACL(new Parse.ACL(request.user))

}, {
  fields: {
    credentials: {
      required : true,
      type     : Object,
    }
  }
})

