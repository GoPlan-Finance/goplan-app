<template>
  <HeadlineActions :headline="watchlist.name">
    <AddToWatchlist :watchlist="watchlist" />
  </HeadlineActions>
  <template v-if="watchlistItems.length > 0">
    <DataTable :config="config" :rows="watchlistItems">
      <template #field(ticker)="{ row }">
        <AppLink
          v-if="row.symbol"
          :ticker="row.symbol.tickerName"
          class="font-bold overflow-hidden overflow-ellipsis"
          to="ticker_details"
        >
          {{ row.symbol.tickerName }}
        </AppLink>
      </template>
      <template #field(name)="{ row }">
        <AppLink
          v-if="row.symbol"
          :ticker="row.symbol.tickerName"
          class="text-sm text-gray-500 overflow-hidden overflow-ellipsis"
          to="ticker_details"
        >
          {{ row.symbol.name }}
        </AppLink>
      </template>
      <template #field(dayPLChange)="{ row }">
        <PriceChange
          v-if="row.lastPrice"
          :compare-from="row.lastPrice.previousClose"
          :compare-to="row.lastPrice.price"
        />
        <GSkeleton class="h-5" v-else />
      </template>
      <template #field(lastPrice)="{ row }">
        <div v-if="row.lastPrice">{{ row.lastPrice.price }}</div>
        <GSkeleton class="h-5" v-else />
      </template>
      <template #actions="{ row }">
        <div class="cursor-pointer hover:text-red-600 text-gray-300" @click="remove(row)">
          <TrashIcon class="h-6 w-6" />
        </div>
      </template>
    </DataTable>
  </template>
  <template v-else>
    <GEmptyState title="No Assets in Watchlist">
      <AddToWatchlist :watchlist="watchlist" />
    </GEmptyState>
  </template>
</template>

<script setup lang="ts">
import { AssetPrice, Watchlist, WatchlistItem } from '@common/models';
import { Holding } from '@common/models/Holding';
import { Query } from '@goplan-finance/utils';
import { TableConfig } from '@components/DataTable/useDataTable';
import DataTable from '@components/DataTable/DataTable.vue';
import PriceChange from '@components/PriceChange.vue';
import AppLink from '@components/router/AppLink.vue';
import { useAssetPriceStore } from '@/store';
import { Screens } from '@/hooks/useScreensize';
import { TrashIcon } from '@heroicons/vue/solid';
import { onUnmounted, ref, watch } from 'vue';
import GEmptyState from '@components/base/GEmptyState.vue';
import AddToWatchlist from '@components/AddToWatchlist.vue';
import GSkeleton from '@components/base/GSkeleton.vue';
import HeadlineActions from '@components/HeadlineActions.vue';

const priceStore = useAssetPriceStore();

const props = defineProps<{
  id: string;
}>();

let liveSubscription: Parse.LiveQuerySubscription | null = null;
let liveSubscription2: Parse.LiveQuerySubscription | null = null;
const watchlistItems = ref<WatchlistItem[]>([]);
const assetPrices = ref<AssetPrice[]>([]);
const watchlist = ref<Watchlist>();
const items = ref([]);

const config: TableConfig = {
  fields: {
    name: {
      classes: 'text-bold',
    },
    ticker: {},
    createdAt: {
      format: 'date',
      justify: 'right',
    },
    dayPLChange: {
      format: 'percent',
      justify: 'right',
      value: (row: Holding) => {
        if (!row.lastPrice || row.lastPrice.price === 0) {
          return null;
        }

        return row.lastPrice.previousClose / row.lastPrice.price - 1;
      },
    },
    lastPrice: {
      justify: 'right',
    },
  },
  tableLayoutCollection: {
    [Screens.DEFAULT]: [
      ['ticker', 'name'],
      ['lastPrice', 'dayPLChange'],
    ],
    [Screens.SM]: [['ticker', 'name'], ['lastPrice'], ['dayPLChange'], ['createdAt']],
  },
  settings: {
    actions: true,
    translationPrefix: 'watchlist.table',
  },
};

const remove = async (watchlistItem: WatchlistItem) => {
  watchlistItem.destroy();
};

await priceStore.subscribe();

const query = Query.create(Watchlist);
watchlist.value = await query.get(props.id);
liveSubscription = await query.liveQuery(null, async wl => {
  watchlist.value = wl;
});

const q2 = Query.create(WatchlistItem);
q2.equalTo('watchlist', watchlist.value);
q2.include('symbol');
liveSubscription2 = await q2.liveQuery(watchlistItems.value);

onUnmounted(async () => {
  if (liveSubscription) {
    await liveSubscription.unsubscribe();
  }
  if (liveSubscription2) {
    await liveSubscription2.unsubscribe();
  }
});

watch(
  watchlistItems,
  async () => {
    const symbols = watchlistItems.value.map(item => item.symbol);

    await priceStore.watch(symbols, (assetPrice: AssetPrice) => {
      const item = watchlistItems.value.find(item => item.symbol?.id === assetPrice.symbol.id);

      item.lastPrice = assetPrice;
    });
  },
  { immediate: true }
);
</script>
