<template>
  <AssetSearch @update:asset-symbol="gotoDetailPage" />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import AssetSearch from './AssetSearch.vue';
import { AssetSymbol } from '@models';

const { push } = useRouter();

const gotoDetailPage = (assetSymbol: AssetSymbol) => {
  push({
    name: 'ticker_details',
    params: {
      ticker: assetSymbol.tickerName,
    },
  });
};
</script>
