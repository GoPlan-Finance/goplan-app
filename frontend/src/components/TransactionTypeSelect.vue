<template>
  <select
    class="rounded"
    name="type"
    :value="value"
    @input="$emit('update:value', $event.target.value)"
  >
    <option v-for="type in types" :key="type.value" :value="type.value">
      {{ type.label }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { TransactionType } from '@models/Transaction';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
  value?: TransactionType;
}>();

const emit = defineEmits<{
  (e: 'update:value', value: string): void;
}>();

const types = Object.entries(TransactionType).map(type => ({
  label: t(`transactions.type.${type[1]}`),
  value: type[1],
}));
</script>
