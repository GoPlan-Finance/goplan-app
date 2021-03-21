/**
 *
 *
 *
 */
// const USE_MASTER_KEY = { useMasterKey: true }
// import { assertEncrypted } from '../../../../common/Auth'


const assertUser = (user: Parse.User) => {
  if (!user) {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'Please log-in')
  }
}

// @ts-ignore
Parse.Cloud.beforeSave('ExternalDataProvider', async (request) => {
  assertUser(request.user)
  // @todo
  // assertEncrypted(request.object, 'credentials')

  request.object.set('user', request.user)
  request.object.setACL(new Parse.ACL(request.user))

}, // @ts-ignore
{
  fields: {
    credentials: {
      required : true,
      type     : Object,
    }
  }
})

