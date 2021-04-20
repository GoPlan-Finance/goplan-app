/**
 *
 *
 *
 */
import { assertEncryptedObject } from '/@common/Auth'
import { SecureObject } from '/@common/models/base/SecureObject'
import { assertUser } from '../../Auth'


Parse.Cloud.beforeSave('Transaction', async (request) => {
  assertEncryptedObject(request.object as SecureObject)
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
      required: true,
    },
    quantity: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      required: true,
    },
    type: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      required: true,
    },
    fees: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      required: false,
    },
    totalExcludingFees : {},
    importRawData      : {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      required: false,
    },
    currency: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      required : true,
      options  : (value : string) => {
        return value.length > 1
      },
      error: 'Invalid currency',
    },


  },
})

