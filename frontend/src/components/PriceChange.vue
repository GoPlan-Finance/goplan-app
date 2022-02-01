<template>
  <div v-if="compareTo && compareFrom" class="overflow-hidden">
    <div
      v-if="total"
      :class="[isPositive ? 'text-green-800' : 'text-red-800']"
      class="rounded-lg px-2"
    >
      <Private>
        <span v-if="isPositive">+</span>
        {{ formatCurrency(difference, currency, { maximumFractionDigits: 2 }) }}
      </Private>
    </div>
    <div
      v-else
      :class="[isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']"
      class="rounded-lg px-2"
    >
      <span v-if="isPositive">+</span>
      {{ formatPercent(percent) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useNumberFormat } from '@/hooks/useNumberFormat';

const { formatPercent, formatCurrency } = useNumberFormat();

const props = defineProps<{
  compareFrom: number;
  compareTo: number;
  currency?: string;
  total?: true;
}>();

const difference = computed(() => props.compareTo - props.compareFrom);
const isPositive = computed(() => difference.value >= 0);
const percent = computed(() => difference.value / props.compareFrom);
</script>
