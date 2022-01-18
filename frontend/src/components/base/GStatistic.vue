<template>
  <div class="flex flex-1 gap-4 bg-white rounded-lg p-4">
    <div
      class="flex h-16 w-16 rounded-lg p-5 text-white items-center justify-center"
      :class="color ?? 'bg-amber-500'"
    >
      <slot name="icon">
        <CurrencyDollarIcon />
      </slot>
    </div>
    <div class="flex flex-1 items-center text-2xl font-bold justify-end">
      <DataField v-bind="$attrs" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { CurrencyDollarIcon } from '@heroicons/vue/outline';
import DataField, { DataFieldItem } from '@components/base/DataField.vue';

const props = defineProps<{
  color?: string;
}>();
</script>
