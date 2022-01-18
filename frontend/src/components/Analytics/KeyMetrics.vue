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
      color="bg-green-500"
      :label="t('Total Increase')"
      :data="holdingStore.totalOpen - holdingStore.totalBookValue"
      :type="DataType.MONEY_CHANGE"
    >
      <template #icon>
        <ArrowUpIcon />
      </template>
    </GStatistic>
    <GStatistic
      class="text-right"
      color="bg-blue-500"
      :label="t('Percent Increase')"
      :data="
        ((holdingStore.totalOpen - holdingStore.totalBookValue) / holdingStore.totalBookValue) * 100
      "
      :type="DataType.PERCENT"
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
