/**
 *
 *
 *
 */
import { Transaction } from '@common/models';
import { Holding } from '@common/models/Holding';
import { Query } from '@goplan-finance/utils';
import { Mutex } from 'async-mutex';

export const findHolding = async (transaction: Transaction): Promise<Holding | null> => {
  if (transaction.symbol) {
    return Query.create(Holding).findOrCreate({ symbol: transaction.symbol }, true, false);
  }

  if (transaction.symbolName) {
    return Query.create(Holding).findOrCreate({ symbolName: transaction.symbolName }, true, false);
  }

  return null;
};

const mutex = new Mutex();

Parse.Cloud.afterSave('Transaction', async request => {
  const transaction = request.object as Transaction;

  await mutex.runExclusive(async () => {
    const holding = await Holding.findOrCreateFromTransaction(transaction, true, false);

    if (holding) {
      if (!holding.createdBy) {
        holding.createdBy = transaction.createdBy;
      }
      if (!holding.currency) {
        holding.currency = transaction.currency;
      }

      holding.setACL(transaction.getACL());

      holding.isOutdated = true;
      // @todo Set HoldingTimeSeries.isOutdated based on transaction date

      await holding.save(null, Holding.useMasterKey(true));
    }
  });
});
