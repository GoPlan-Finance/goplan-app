<template>
  <HeadlineActions :headline="t('Analytics')">
    <template #default>
      <BuySellAsset />
    </template>
  </HeadlineActions>
  <div class="grid grid-cols-1 md:grid-cols-2" />
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
    <div class="grid grid-cols-3 md:grid-cols-1 gap-4">
      <GStatistic>
        <DataFormatter :data="holdingStore.totalOpen" type="money" />
      </GStatistic>
      <GStatistic>
        <DataFormatter :data="holdingStore.totalOpen" type="money" />
      </GStatistic>
      <GStatistic>
        <DataFormatter :data="holdingStore.totalOpen" type="money" />
      </GStatistic>
    </div>
    <div class="lg:col-span-2">
      <div class="rounded-lg bg-white overflow-hidden p-6 mb-6">
        <HoldingTimeSeriesChart />
      </div>
    </div>
  </div>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
    <div class="lg:col-span-2">
      <AllocationTable />
    </div>
    <div class="bg-white rounded p-4">
      <TypeAllocationChart />
    </div>
  </div>
</template>

<script setup lang="ts">
import BuySellAsset from '@components/BuySellAsset.vue';
import HoldingTimeSeriesChart from '@components/Charts/HoldingTimeSeriesChart.vue';
import HeadlineActions from '@components/HeadlineActions.vue';
import { useI18n } from 'vue-i18n';
import AllocationTable from '@components/Analytics/AllocationTable.vue';
import TypeAllocationChart from '@components/Analytics/TypeAllocationChart.vue';
import GStatistic from '@components/base/GStatistic.vue';
import { useHoldingStore } from '@/store';
import DataField from '@components/base/DataField.vue';
import DataFormatter from '@components/base/DataFormatter.vue';

const { t } = useI18n();

const holdingStore = useHoldingStore();
await holdingStore.subscribe();
</script>
