/**
 *
 *
 *
 */
import { AssetSymbol, Transaction } from '/@common/models'
import { Holding } from '/@common/models/Holding'
import { Query } from '/@common/Query'


const findHolding    = async (transaction : Transaction) => {

  if (transaction.symbol) {
    return Query.create(Holding).findOrCreate({symbol: transaction.symbol}, true, false)

  }

  if (transaction.symbolName) {
    return Query.create(Holding).findOrCreate({symbolName: transaction.symbolName}, true, false)
  }

  return null
}


Parse.Cloud.afterSave('Transaction', async (request) => {

  const transaction = request.object as Transaction

  const holding = await Holding.findOrCreateFromTransaction(transaction, true, false)

  if (holding) {

    if (holding.isNew()) {
      holding.setACL(transaction.getACL())
    }

    holding.isOutdated = true

    await holding.save(null, Holding.useMasterKey(true))
  }


})

