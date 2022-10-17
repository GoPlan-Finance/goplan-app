<template>
  <HeadlineActions :headline="t('Analytics')">
    <template #default>
      <BuySellAsset />
    </template>
  </HeadlineActions>
  <template v-if="holdingStore.hasOpenHoldings">
    <div class="grid grid-cols-1 xl:grid-cols-3 mb-4">
      <div>
        <GHeadline class="mb-4">{{ t('Key Metrics') }}</GHeadline>
        <KeyMetrics />
      </div>
      <div class="lg:col-span-2">
        <GHeadline class="mb-4">{{ t('Performance') }}</GHeadline>
        <div class="rounded-lg bg-white overflow-hidden p-6">
          <HoldingTimeSeriesChart />
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <div class="xl:col-span-2">
        <GHeadline class="mb-4">{{ t('Asset Types') }}</GHeadline>
        <AllocationTable />
      </div>
      <div class="bg-white rounded-lg p-4">
        <TypeAllocationChart />
      </div>
    </div>
  </template>
  <GEmptyState v-else>
    {{ t('No Transactions') }}
  </GEmptyState>
</template>

<script setup lang="ts">
import BuySellAsset from '@components/TransactionModal.vue';
import HoldingTimeSeriesChart from '@components/Charts/HoldingTimeSeriesChart.vue';
import HeadlineActions from '@components/HeadlineActions.vue';
import { useI18n } from 'vue-i18n';
import AllocationTable from '@components/Analytics/AllocationTable.vue';
import TypeAllocationChart from '@components/Analytics/TypeAllocationChart.vue';
import KeyMetrics from '@components/Analytics/KeyMetrics.vue';
import GHeadline from '@components/base/GHeadline.vue';
import { useHoldingStore } from '@/store';
import GEmptyState from '@components/base/GEmptyState.vue';

const { t } = useI18n();

const holdingStore = useHoldingStore();
await holdingStore.subscribe();
</script>
