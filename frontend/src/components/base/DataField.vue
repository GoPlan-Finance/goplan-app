<template>
  <div class="min-w-full grid grid-cols-1">
    <dt class="text-sm font-medium text-gray-500">
      {{ label }}
    </dt>
    <dd class="mt-1 text-gray-900 sm:mt-0">
      <DataFormatter :data="data" :type="type" :currency="currency" />
    </dd>
  </div>
</template>

<script setup lang="ts">
import { DataType } from '@/types';
import DataFormatter from '@components/base/DataFormatter.vue';

export interface DataFieldItem {
  label: string;
  data: string | string[] | number | Date;
  type?: DataType;
  currency?: string;
}

const props = withDefaults(defineProps<DataFieldItem>(), { type: DataType.STRING });
</script>
