<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 mb-4 xl:mb-0 xl:mr-4 gap-4">
    <GStatistic
      class="text-right"
      :label="t('Total Value')"
      :data="holdingStore.totalOpen"
      :type="DataType.MONEY"
    />
    <GStatistic
      class="text-right"
      color="bg-green-600"
      :label="t('Total Change')"
      :data="holdingStore.totalChangeValue"
      :type="DataType.MONEY_CHANGE"
    >
      <template #icon>
        <ArrowUpIcon class="rotate-45" />
      </template>
    </GStatistic>
    <GStatistic
      class="text-right"
      color="bg-blue-600"
      :label="t('Percent Change')"
      :data="holdingStore.totalChangePercent"
      :type="DataType.PERCENT_CHANGE"
    >
      <template #icon>
        <ClockIcon />
      </template>
    </GStatistic>
  </div>
</template>

<script setup lang="ts">
import GStatistic from '@components/base/GStatistic.vue';
import { useHoldingStore } from '@/store';
import { ArrowUpIcon, ClockIcon } from '@heroicons/vue/outline';
import { DataType } from '@/types';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const holdingStore = useHoldingStore();
await holdingStore.subscribe();
</script>
