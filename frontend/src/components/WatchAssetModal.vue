<template>
  <Modal title="Add to Watchlist">
    <template #button>
      <ButtonDefault type="secondary" label="Watch">
        <template #before>
          <EyeIcon class="h-5" />
        </template>
      </ButtonDefault>
    </template>
    <template #content>
      <div class="flex flex-col gap-2">
        <div v-for="(watchlist, index) in watchlists" :key="index">
          <div
            v-if="!existsInWatchlist(watchlist)"
            class="flex justify-between cursor-pointer bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-300"
            @click="addToWatchlist(watchlist)"
          >
            {{ watchlist.name }}
            <div v-if="existsInWatchlist(watchlist)">
              <CheckCircleIcon class="h-5 text-green-600" />
            </div>
          </div>
          <div
            v-else
            class="flex justify-between cursor-not-allowed bg-gray-100 px-4 py-2 rounded-lg"
          >
            {{ watchlist.name }}
            <CheckCircleIcon class="h-5 text-green-600" />
          </div>
        </div>
      </div>
    </template>
    <template #actions="{ close }">
      <ButtonDefault label="Close" @click="close()" />
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { AssetSymbol, Watchlist, WatchlistItem } from '@common/models';
import ButtonDefault from './base/ButtonDefault.vue';
import { EyeIcon, CheckCircleIcon } from '@heroicons/vue/solid';
import Modal from '@components/base/GoModal.vue';
import { useI18n } from 'vue-i18n';
import { useWatchlist } from '@/hooks/useWatchlist';

const { t } = useI18n();
const { watchlists, load } = useWatchlist();

const props = defineProps<{
  assetSymbol: AssetSymbol;
}>();

const existsInWatchlist = (watchlist: Watchlist) => {
  return watchlist.symbols.some(item => item.id === props.assetSymbol.id);
};

const addToWatchlist = async (watchlist: Watchlist) => {
  try {
    const watchlistItem = new WatchlistItem();
    watchlistItem.watchlist = watchlist;
    watchlistItem.symbol = props.assetSymbol;
    await watchlistItem.save();
    await load();
    alert(t('Added to watchlist'));
  } catch (e) {
    alert(t('Error trying to add to watchlist: ') + e);
  }
};

await load();
</script>
