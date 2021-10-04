<template>
  <AssetSearch @update:ticker-name="gotoDetailPage" />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import AssetSearch from './AssetSearch.vue';

const { push } = useRouter();

const gotoDetailPage = (tickerName: string) => {
  push({
    name: 'ticker_details',
    params: {
      ticker: tickerName,
    },
  });
};
</script>
