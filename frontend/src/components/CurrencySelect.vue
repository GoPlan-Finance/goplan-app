<template>
  <select
    class="rounded w-full"
    name="currency"
    :value="value"
    @input="$emit('update:value', $event.target.value)"
  >
    <option v-for="currency in currencyList" :key="currency.code" :value="currency.code">
      {{ currency.name }} ({{ currency.symbol }})
    </option>
  </select>
</template>

<script setup lang="ts">
import { Currencies, Currency } from 'ts-money';

const props = defineProps<{
  value?: string;
}>();

const currencyList: Record<string, Currency> = Currencies;

const emit = defineEmits<{
  (e: 'update:value'): void;
}>();
</script>
