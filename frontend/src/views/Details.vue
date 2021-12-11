<template>
  <template v-if="!loading && assetSymbol">
    <HeadlineActions>
      <template #headline>
        <div class="flex flex-col">
          <div>
            {{ assetSymbol.name }}
          </div>
          <div class="text-base text-gray-500 font-medium">
            {{ assetSymbol.tickerName }}
          </div>
        </div>
      </template>
      <template #default>
        <BuySellAsset :asset-symbol="assetSymbol" />
        <WatchAssetModal :asset-symbol="assetSymbol" />
      </template>
    </HeadlineActions>
    <div class="grid grid-cols-1 md:grid-cols-2">
      <AssetPrice :symbol="assetSymbol" />
    </div>
    <div class="rounded-lg bg-white overflow-hidden p-6 mb-6">
      <Suspense>
        <CandlestickChart :asset-symbol="assetSymbol" />
        <template #fallback>
          <GSkeleton style="height: 500px" />
        </template>
      </Suspense>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <CompanyQuote :asset-symbol="assetSymbol" />
      </div>
      <div>
        <CompanyInfo :asset-symbol="assetSymbol" />
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { AssetSymbol } from '@common/models';
import BuySellAsset from '@components/BuySellAsset.vue';
import CandlestickChart from '@components/Charts/CandleStickChart/CandlestickChart.vue';
import CompanyInfo from '@components/CompanyInfo.vue';
import CompanyQuote from '@components/CompanyQuote.vue';
import HeadlineActions from '@components/HeadlineActions.vue';
import WatchAssetModal from '@components/WatchAssetModal.vue';
import { onBeforeMount, onUnmounted, ref, watch } from 'vue';
import AssetPrice from '@components/AssetPrice.vue';
import GSkeleton from '@components/base/GSkeleton.vue';

const props = defineProps<{
  ticker: string;
}>();

const liveSubscription = ref<Parse.LiveQuerySubscription>();
const loading = ref(false);
const assetSymbol = ref<AssetSymbol>();

const loadAssetSymbol = async () => {
  loading.value = true;
  assetSymbol.value = await AssetSymbol.fetchSymbolByTicker(props.ticker);
  loading.value = false;

  if (liveSubscription.value) {
    await liveSubscription.value.unsubscribe();
  }
};

watch(() => props.ticker, loadAssetSymbol);

onBeforeMount(async () => {
  await loadAssetSymbol();
});

onUnmounted(async () => {
  if (liveSubscription.value) {
    await liveSubscription.value.unsubscribe();
  }
});
</script>
