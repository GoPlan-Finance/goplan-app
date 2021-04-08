/**
 *
 *
 *
 */
// const USE_MASTER_KEY = { useMasterKey: true }
// import { assertEncrypted } from '../../../../common/Auth'

import { assertEncrypted } from '../../../../../common/Auth'
import { EncryptedValue } from '../../../../../common/Crypto'
import { assertUser } from '../../Auth'


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
      options  : (value : EncryptedValue) => {
        assertEncrypted(value)
      },
      error: 'Invalid Price',
    },
    quantity: {
      required : true,
      options  : (value : EncryptedValue) => {
        assertEncrypted(value)
      },
      error: 'Invalid quantity',
    },
    type: {
      required : true,
      options  : (value : EncryptedValue) => {
        assertEncrypted(value)
      },
      error: 'Invalid type',
    },
    currency: {
      required : true,
      options  : (value : string) => {
        return value.length > 1
      },
      error: 'Invalid type',
    },

  },
})

