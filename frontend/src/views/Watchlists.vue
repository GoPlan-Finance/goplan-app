<template>
  <div>
    <HeadlineActions :headline="$t('watchlists.headline')">
      <AddWatchlist />
    </HeadlineActions>
    <template v-if="watchlists.length > 0">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="watchlist of watchlists" :key="watchlist.id">
          <div class="shadow-md overflow-hidden rounded-lg">
            <div class="bg-white px-6 py-4">
              <div class="text-gray-900 font-bold text-xl mb-1">
                {{ watchlist.name }}
                <small v-if="watchlist.symbolsCount" class="font-normal text-xs"
                  >({{ watchlist.symbolsCount }} stocks)</small
                >
              </div>

              <div class="text-gray-500 text-sm mb-2">
                {{ $t('watchlists.updated') }} {{ dayjs(watchlist.updatedAt).fromNow() }}
              </div>

              <div
                :class="
                  watchlist.percentChange >= 0
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                "
                class="min-w-min p-3 text-xl rounded-lg font-bold"
              >
                <span v-if="watchlist.percentChange >= 0">+</span
                >{{ watchlist.percentChange.toFixed(2) }} %
              </div>
            </div>
            <div class="flex justify-between px-6 py-4 bg-gray-50 text-gray-500">
              <AppLink :id="watchlist.id" class="hover:text-blue-500" to="watchlist">
                {{ $t('watchlists.show_more') }}
              </AppLink>
              <div
                class="cursor-pointer text-gray-400 hover:text-red-600"
                @click="remove(watchlist)"
              >
                <TrashIcon class="h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <GEmptyState title="No Watchlists">
        <AddWatchlist />
      </GEmptyState>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Watchlist, WatchlistItem } from '@common/models';
import { Query } from '@goplan-finance/utils';
import AddWatchlist from '@components/AddWatchlist.vue';
import HeadlineActions from '@components/HeadlineActions.vue';
import dayjs from 'dayjs';
import { onBeforeMount, onUnmounted, ref } from 'vue';
import GEmptyState from '@components/base/GEmptyState.vue';
import { TrashIcon } from '@heroicons/vue/outline';
import ButtonDefault from '@components/base/ButtonDefault.vue';

const watchlists = ref<Watchlist[]>([]);
let liveSubscription = null;

const q = new Query(Watchlist);
liveSubscription = await q.liveQuery(watchlists.value, async (watchlist: Watchlist) => {
  watchlist.percentChange = Math.random() * 10 - 3.5; // Todo: Add percentChange query
  watchlist.symbolsCount = await Query.create(WatchlistItem)
    .equalTo('watchlist', watchlist)
    .count();
});

onUnmounted(async () => {
  if (liveSubscription) {
    await liveSubscription.unsubscribe();
  }
});

async function remove(watchlist: Watchlist) {
  watchlist.destroy();
}
</script>
