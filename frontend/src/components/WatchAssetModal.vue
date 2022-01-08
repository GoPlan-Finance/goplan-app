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
            class="cursor-pointer bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-300"
            @click="addToWatchlist(watchlist)"
          >
            {{ watchlist.name }}
          </div>
        </div>
      </div>
    </template>
    <template #actions="slotProps">
      <ButtonDefault label="Close" @click="slotProps.close()" />
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { AssetSymbol, Watchlist, WatchlistItem } from '@common/models';
import { Query } from '@goplan-finance/utils';
import { onUnmounted, ref } from 'vue';
import ButtonDefault from './base/ButtonDefault.vue';
import { EyeIcon } from '@heroicons/vue/solid';
import Modal from '@components/base/GoModal.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
  assetSymbol: AssetSymbol;
}>();

const liveSubscription = ref<Parse.LiveQuerySubscription>();
const watchlists = ref<Watchlist[]>([]);

const addToWatchlist = async (watchlist: Watchlist) => {
  try {
    const watchlistItem = new WatchlistItem();
    watchlistItem.watchlist = watchlist;
    watchlistItem.symbol = props.assetSymbol;
    await watchlistItem.save();
    alert(t('Added to watchlist'));
  } catch (e) {
    alert(t('Error trying to add to watchlist: ') + e);
  }
};

const query = new Query(Watchlist);
liveSubscription.value = await query.liveQuery(watchlists.value);

onUnmounted(async () => {
  if (liveSubscription) {
    await liveSubscription.unsubscribe();
  }
});
</script>
