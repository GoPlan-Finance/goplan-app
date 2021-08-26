/**
 *
 *
 *
 */
import { Holding } from '@common/models';
import { Query } from '@utils/parse/Query';

Parse.Cloud.job('Holdings--MarkAllAsOutdated', async request => {
  const q = Query.create(Holding);

  await q.each(async holding => {
    holding.isOutdated = true;
    await holding.save(null, Holding.useMasterKey(true));
  }, Holding.useMasterKey(true));
});
