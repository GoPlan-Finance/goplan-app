<template>
  <h3 class="text-gray-700 text-xl font-bold mb-6">Asset Price</h3>
  <AssetPrice :current-price="currentPrice" :previous-price="previousPrice" class="mb-2" />
</template>

<script lang="ts">
import AssetPrice from '@components/AssetPrice.vue';
import { Currencies, Money } from 'ts-money';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { AssetPrice },
  setup() {
    return {
      currentPrice: Money.fromDecimal(18, Currencies.USD),
      previousPrice: Money.fromDecimal(19, Currencies.USD),
    };
  },
});
</script>
