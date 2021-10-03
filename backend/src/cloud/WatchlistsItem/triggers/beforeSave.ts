/**
 *
 *
 *
 */

import { WatchlistItem } from '@common/models';

import { Query } from '@goplan-finance/utils';
import { assertUser } from '../../Auth';

Parse.Cloud.beforeSave(
  WatchlistItem,
  async request => {
    assertUser(request);

    const object = request.object as WatchlistItem;

    if (object.isNew()) {
      object.set('createdBy', request.user);
    }

    if (!request.master) {
      object.setACL(new Parse.ACL(request.user));
    }

    if (object.isNew()) {
      const q = Query.create(WatchlistItem);
      q.equalTo('symbol', object.symbol);
      q.equalTo('watchlist', object.watchlist);

      if ((await q.count(WatchlistItem.useMasterKey(true))) !== 0) {
        throw `Symbol ${object.symbol.id} already present in watchlist ${object.watchlist.id}`;
      }
    }
  },
  {
    fields: {
      symbol: {
        constant: true,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        required: true,
      },
      watchlist: {
        constant: true,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        required: true,
      },
    },
  }
);
