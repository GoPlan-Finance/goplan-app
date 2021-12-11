<template>
  <div v-if="compareTo && compareFrom" class="flex flex-wrap overflow-hidden">
    <div
      v-if="type === 'percentage'"
      :class="[isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']"
      class="rounded-lg p-1 ml-1"
    >
      <span v-if="isPositive">+</span><span v-else>-</span> {{ percent.toFixed(2) }} %
    </div>
    <div
      v-if="type === 'total'"
      :class="[isPositive ? 'text-green-800' : 'text-red-800']"
      class="flex items-center rounded-lg"
    >
      <Private>
        <span v-if="isPositive">+</span>
        {{ formatCurrency(total, currency, true) }}
      </Private>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CurrencyUtils } from '@goplan-finance/utils';

const props = withDefaults(
  defineProps<{
    compareFrom: number;
    compareTo: number;
    currency?: string;
    type?: 'percentage' | 'total';
  }>(),
  { type: 'percentage' }
);

const total = computed(() => props.compareTo - props.compareFrom);
const isPositive = computed(() => total.value >= 0);
const percent = computed(() => (total.value / props.compareFrom) * 100);

const formatCurrency = CurrencyUtils.formatCurrency;
</script>
