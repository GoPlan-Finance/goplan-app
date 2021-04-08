/**
 *
 *
 *
 */
// const USE_MASTER_KEY = { useMasterKey: true }
// import { assertEncrypted } from '../../../../common/Auth'

import { assertEncrypted } from '/common/Auth'
import { EncryptedValue } from '/common/Crypto'
import { assertUser } from '../../Auth'


Parse.Cloud.beforeSave('Account', async (request) => {
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
      options  : (value : EncryptedValue) => {
        assertEncrypted(value)
      },
    },
    // currency: {
    //   required : false,
    //   options  : (value : string) => {
    //     return value.length > 1
    //   },
    //   error: 'Invalid currency',
    // },


  },
})

