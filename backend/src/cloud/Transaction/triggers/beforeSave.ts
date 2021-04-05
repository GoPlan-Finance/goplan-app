/**
 *
 *
 *
 */
// const USE_MASTER_KEY = { useMasterKey: true }
// import { assertEncrypted } from '../../../../common/Auth'

import {assertUser} from '../../Auth'
import {assertEncrypted} from '../../../../../common/Auth'
import {EncryptedValue} from '../../../../../common/Crypto'

Parse.Cloud.beforeSave('Transaction', async (request) => {
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
    price: {
      required : true,
      options  : (value: EncryptedValue) => {
        assertEncrypted(value)
      },
      error: 'Invalid Price'
    },
    quantity: {
      required : true,
      options  : (value: EncryptedValue) => {
        assertEncrypted(value)
      },
      error: 'Invalid quantity'
    },
    type: {
      required : true,
      options  : (value: EncryptedValue) => {
        assertEncrypted(value)
      },
      error: 'Invalid type'
    },

  }
})

