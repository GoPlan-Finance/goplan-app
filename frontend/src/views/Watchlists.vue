<template>
  <div>
    <HeadlineActions :headline="t('watchlists.headline')">
      <AddWatchlist />
    </HeadlineActions>
    <template v-if="watchlists.length > 0">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="watchlist of watchlists" :key="watchlist.id">
          <div class="shadow-md overflow-hidden rounded-lg">
            <div class="bg-white px-6 py-4">
              <div class="text-gray-900 font-bold text-xl mb-1">
                {{ watchlist.name }}
              </div>
              <div class="text-gray-500 text-sm mb-4">
                {{ t('watchlists.updated') }} {{ dayjs(watchlist.updatedAt).fromNow() }}
              </div>
              <div
                v-for="symbol in watchlist.symbols"
                class="inline bg-blue-100 m-1 px-2 py-1 rounded-lg"
              >
                {{ symbol.tickerName }}
              </div>
              <div v-if="watchlist.symbols.length === 0">
                {{ t('watchlists.no_assets') }}
              </div>
            </div>
            <div class="flex justify-between px-6 py-4 bg-gray-50 text-gray-500">
              <AppLink :id="watchlist.id" class="hover:text-blue-500" to="watchlist">
                {{ t('watchlists.show_more') }}
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
import { Watchlist } from '@common/models';
import AddWatchlist from '@components/AddWatchlist.vue';
import HeadlineActions from '@components/HeadlineActions.vue';
import dayjs from 'dayjs';
import GEmptyState from '@components/base/GEmptyState.vue';
import { TrashIcon } from '@heroicons/vue/outline';
import { useI18n } from 'vue-i18n';
import { useWatchlist } from '@/hooks/useWatchlist';

const { t } = useI18n();

const { watchlists, load } = useWatchlist();

async function remove(watchlist: Watchlist) {
  watchlist.destroy();
}

await load();
</script>
