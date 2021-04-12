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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      required : true,
      options  : (value : EncryptedValue) => {
        assertEncrypted(value)
      },
    },
    quantity: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      required : true,
      options  : (value : EncryptedValue) => {
        assertEncrypted(value)
      },
    },
    type: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      required : true,
      options  : (value : EncryptedValue) => {
        assertEncrypted(value)
      },
    },
    fees: {// eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
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
    importRawData: {// eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      required : false,
      options  : (value : EncryptedValue) => {
        assertEncrypted(value)
      },
    },
    currency: {// eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      required : true,
      options  : (value : string) => {
        return value.length > 1
      },
      error: 'Invalid currency',
    },


  },
})

