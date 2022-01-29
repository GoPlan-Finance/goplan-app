<template>
  <select
    class="rounded w-full"
    name="currency"
    :value="value"
    @input="$emit('update:value', $event.target.value)"
  >
    <option v-for="localeItem in locale.all" :key="localeItem.lcid" :value="localeItem.tag">
      {{ localeItem.name }}, {{ localeItem.location }} ({{ localeItem.tag }})
    </option>
  </select>
</template>

<script setup lang="ts">
import * as locale from 'locale-codes';

const props = defineProps<{
  value?: string;
}>();

const emit = defineEmits<{
  (e: 'update:value'): void;
}>();
</script>
