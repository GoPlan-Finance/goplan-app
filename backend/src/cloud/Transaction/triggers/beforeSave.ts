/**
 *
 *
 *
 */
import { assertEncryptedObject } from '/@common/Auth'
import { Holding, Transaction } from '/@common/models'
import { SecureObject } from '/@common/models/base/SecureObject'
import { assertUser } from '../../Auth'


Parse.Cloud.beforeSave('Transaction', async (request) => {
  assertEncryptedObject(request.object as SecureObject)
  assertUser(request)

  const transaction = request.object as Transaction

  if (transaction.isNew()) {
    transaction.set('createdBy', request.user)

    const holding = await Holding.findOrCreateFromTransaction(transaction, true, true)


    if (holding) {
      transaction.holding = holding
    }


  }

  if (!request.master) {
    transaction.setACL(new Parse.ACL(request.user))
  }


},
{
  fields: {
    holding: {
      constant: true,
    },
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

