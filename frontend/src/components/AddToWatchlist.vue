<template>
  <Modal v-model="isModalOpen" title="Add Asset to Watchlist">
    <template #button>
      <ButtonDefault label="Add Asset">
        <template #before>
          <PlusCircleIcon class="h-6 w-6" />
        </template>
      </ButtonDefault>
    </template>
    <template #content>
      <label>
        <div class="text-gray-400 ml-2 mb-1">Asset</div>

        <div v-if="symbol" class="bg-gray-100 px-4 py-2 rounded relative">
          <div>
            <div class="w-14 min-w-min">{{ symbol.tickerName }}</div>
            <div class="text-gray-500 text-sm">{{ symbol.name }}</div>
          </div>
          <XCircleIcon
            @click="symbol = null"
            class="absolute right-4 top-5 h-5 text-gray-400 hover:text-gray-500 cursor-pointer"
          />
        </div>
        <AssetSearch
          v-else
          @update:asset-symbol="symbol = $event"
          class="w-full"
          search-field-class="border w-full"
        />
      </label>
    </template>
    <template #actions>
      <ButtonDefault
        class="inline-flex items-center px-2 mr-1 bg-green-400 rounded-xl cursor-pointer hover:bg-gray-300 select-none"
        label="Save"
        @click="save"
      />
    </template>
  </Modal>
</template>

<script setup lang="ts">
import AssetSearch from '@components/AssetSearch.vue';
import Modal from '@components/base/GoModal.vue';
import ButtonDefault from './base/ButtonDefault.vue';
import { PlusCircleIcon, XCircleIcon } from '@heroicons/vue/outline';
import { ref } from 'vue';
import { AssetSymbol, Watchlist, WatchlistItem } from '@models';

const props = defineProps<{
  watchlist: Watchlist;
}>();

const emit = defineEmits<{
  (e: 'save', asset: AssetSymbol): void;
}>();

const isModalOpen = ref(false);
const symbol = ref<AssetSymbol>();

const save = async () => {
  if (!symbol) {
    return;
  }
  // if (items.value.find(item => item.symbol.id === selectedAsset.value.id)) {
  //   console.warn('Symbol already exists');
  //   selectedAsset.value = null;
  //   return;
  // }
  try {
    const watchlistItem = new WatchlistItem();

    watchlistItem.watchlist = props.watchlist;
    watchlistItem.symbol = symbol.value;

    await watchlistItem.save();

    symbol.value = null;
    isModalOpen.value = false;
  } catch (e) {
    alert(e);
  }
};
</script>
