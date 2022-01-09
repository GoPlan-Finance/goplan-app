import { onUnmounted, ref } from 'vue';
import { Query } from '@goplan-finance/utils';
import { Watchlist, WatchlistItem } from '@models';

export const useWatchlist = () => {
  const watchlists = ref<Watchlist[]>([]);
  const liveSubscription = ref<Parse.LiveQuerySubscription>();

  const load = async () => {
    watchlists.value = [];
    const query = new Query(Watchlist);
    liveSubscription.value = await query.liveQuery(
      watchlists.value,
      async (watchlist: Watchlist) => {
        const result = await Query.create(WatchlistItem)
          .equalTo('watchlist', watchlist)
          .include('symbol');

        watchlist.symbols = await result.map(item => item.symbol);
      }
    );
  };

  onUnmounted(async () => {
    if (liveSubscription) {
      await liveSubscription.value.unsubscribe();
    }
  });

  return {
    watchlists,
    load,
  };
};
