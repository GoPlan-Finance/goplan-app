<template>
  <div class="flex flex-wrap overflow-hidden p-6 mb-6 bg-white rounded-lg">
    <template v-for="(detail, index) in details">
      <DataField
        v-if="detail.data"
        :key="index"
        :data="detail.data"
        :label="$t('quote.' + detail.label)"
        :type="detail.type"
        class="mb-2"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { AssetSymbol } from '@common/models';
import { computed, onBeforeMount, ref } from 'vue';
import { CompanyQuote } from '../../../backend/src/cloud/DataProviders/providers/types'; // @todo
import DataField from './base/DataField.vue';

type Detail = {
  type: string;
  label: string;
  data: string | number;
};

const props = defineProps<{
  assetSymbol: AssetSymbol;
}>();

const info = ref<CompanyQuote>();

onBeforeMount(async () => {
  info.value = await Parse.Cloud.run('Assets--GetQuote', {
    assetSymbolId: props.assetSymbol.id,
  });

  console.log(info.value);
});

const details = computed<Detail[]>(() => {
  if (!info.value) {
    return [];
  }

  return [
    {
      type: 'money',
      label: 'open',
      data: info.value.open,
    },
    {
      type: 'money',
      label: 'previousClose',
      data: info.value.previousClose,
    },
    {
      type: 'percent',
      label: 'change_percent',
      data: info.value.changesPercentage,
    },
    {
      type: 'moneyChange',
      label: 'change',
      data: info.value.change,
    },
    {
      type: 'moneyRange',
      label: 'dayRange',
      data: [info.value.dayLow, info.value.dayHigh],
    },
    {
      type: 'moneyRange',
      label: 'yearRange',
      data: [info.value.yearLow, info.value.yearHigh],
    },
    {
      type: 'number',
      label: 'marketCap',
      data: info.value.marketCap,
    },
    {
      type: 'money',
      label: 'priceAvg50',
      data: info.value.priceAvg50,
    },
    {
      type: 'money',
      label: 'priceAvg200',
      data: info.value.priceAvg200,
    },
    {
      type: 'number',
      label: 'volume',
      data: info.value.volume,
    },
    {
      type: 'number',
      label: 'avgVolume',
      data: info.value.avgVolume,
    },
    {
      label: 'exchange',
      data: info.value.exchange,
    },
    {
      type: 'number',
      label: 'eps',
      data: info.value.eps,
    },
    {
      type: 'number',
      label: 'pe',
      data: info.value.pe,
    },
    {
      type: 'date',
      label: 'earningsAnnouncement',
      data: info.value.earningsAnnouncement,
    },
    {
      type: 'number',
      label: 'sharesOutstanding',
      data: info.value.sharesOutstanding,
    },
  ];
});
</script>
