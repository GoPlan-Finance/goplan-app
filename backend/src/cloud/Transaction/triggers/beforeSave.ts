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


Parse.Cloud.beforeSave('Transaction', async (request) => {
  assertUser(request)

  if (request.object.isNew()) {
    request.object.set('createdBy', request.user)
  }

  if (!request.master) {
    request.object.setACL(new Parse.ACL(request.user))
  }
},
{
  fields: {
    price: {
      required : true,
      options  : (value : EncryptedValue) => {
        assertEncrypted(value)
      },
    },
    quantity: {
      required : true,
      options  : (value : EncryptedValue) => {
        assertEncrypted(value)
      },
    },
    type: {
      required : true,
      options  : (value : EncryptedValue) => {
        assertEncrypted(value)
      },
    },
    fees: {
      required : false,
      options  : (value : EncryptedValue) => {
        assertEncrypted(value)
      },
    },
    totalExcludingFees: {
      options: (value : EncryptedValue) => {
        assertEncrypted(value)
      },
    },
    importRawData: {
      required : false,
      options  : (value : EncryptedValue) => {
        assertEncrypted(value)
      },
    },
    currency: {
      required : true,
      options  : (value : string) => {
        return value.length > 1
      },
      error: 'Invalid currency',
    },


  },
})

