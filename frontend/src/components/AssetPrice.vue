<template>
  <div v-if="price" class="flex flex-wrap overflow-hidden gap-2">
    <div class="text-5xl font-bold">
      {{ formatCurrency(price.price, symbol.currency, false, 'en-us', 'never') }}
    </div>
    <PriceChange :compare-from="price.previousClose" :compare-to="price.price" />
    <PriceChange
      :compare-from="price.previousClose"
      :compare-to="price.price"
      :currency="symbol.currency"
      type="total"
    />
  </div>
  <div v-else>
    {{ $t('details.no_price') }}
  </div>
</template>

<script setup lang="ts">
import { AssetPrice, AssetSymbol } from '@common/models';
import PriceChange from '@components/PriceChange.vue';
import { CurrencyUtils } from '@goplan-finance/utils';
import { onUnmounted, ref } from 'vue';

const props = defineProps<{
  symbol: AssetSymbol;
}>();

const liveSubscription = ref<Parse.LiveQuerySubscription>();
const price = ref<AssetPrice>();

liveSubscription.value = await AssetPrice.liveQuery(props.symbol, assetPrice => {
  price.value = assetPrice;
});

onUnmounted(async () => {
  if (liveSubscription) {
    await liveSubscription.value.unsubscribe();
  }
});

const formatCurrency = CurrencyUtils.formatCurrency;
</script>
