/**
 *
 *
 *
 */
// const USE_MASTER_KEY = { useMasterKey: true }
// import { assertEncrypted } from '../../../../common/Auth'

import {assertUser} from '../../Auth'

Parse.Cloud.beforeSave('Watchlist', async (request) => {
  assertUser(request)


  if (request.object.isNew()) {
    request.object.set('createdBy', request.user)
  }

  if (!request.master) {
    request.object.setACL(new Parse.ACL(request.user))
  }
},
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
{
  fields: {
    name: {
      required : true,
      options  : (name: string) => {
        return name.length > 1
      },
      error: 'The name is too short'
    }
  }
})

