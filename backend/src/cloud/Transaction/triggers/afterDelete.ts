/**
 *
 *
 *
 */
import { Transaction } from '@common/models';
import { Holding } from '@common/models/Holding';
import { Query } from '@goplan-finance/utils';
import { findHolding } from './afterSave';

Parse.Cloud.afterDelete(Transaction, async request => {
  const holding = await findHolding(request.object);

  if (holding) {
    const q = Query.create(Transaction);
    q.equalTo('holding', holding);

    if ((await q.count(Holding.useMasterKey(true))) === 0) {
      await holding.destroy(Holding.useMasterKey(true));
    }
  }
});
