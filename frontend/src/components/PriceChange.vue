<template>
  <div v-if="compareTo && compareFrom" class="overflow-hidden">
    <div v-if="total" :class="[isPositive ? 'text-green-800' : 'text-red-800']" class="rounded-lg">
      <Private>
        <span v-if="isPositive">+</span>
        {{ formatCurrency(difference, currency, true) }}
      </Private>
    </div>
    <div
      v-else
      :class="[isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']"
      class="rounded-lg p-1 ml-1"
    >
      <span v-if="isPositive">+</span>
      {{ percent.toLocaleString(undefined, { maximumFractionDigits: 2 }) }} %
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CurrencyUtils } from '@goplan-finance/utils';

const props = defineProps<{
  compareFrom: number;
  compareTo: number;
  currency?: string;
  total?: true;
}>();

const difference = computed(() => props.compareTo - props.compareFrom);
const isPositive = computed(() => difference.value >= 0);
const percent = computed(() => (difference.value / props.compareFrom) * 100);

const formatCurrency = CurrencyUtils.formatCurrency;
</script>
