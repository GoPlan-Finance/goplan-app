/**
 *
 *
 *
 */
// const USE_MASTER_KEY = { useMasterKey: true }
// import { assertEncrypted } from '../../../../common/Auth'
import {assertUser} from "../../Auth";

Parse.Cloud.beforeSave('ExternalDataProvider', async (request) => {
  assertUser(request)
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

