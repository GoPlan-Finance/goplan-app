<template>
  <div class="relative">
    <span class="absolute inset-y-0 left-0 pl-3 flex items-center">
      <SearchIcon class="h-5 w-5 text-gray-300" />
    </span>
    <input
      :class="inputClass"
      :value="value"
      class="w-100 rounded pl-10 pr-4 py-2 focus:border-blue-300 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50"
      :placeholder="placeholder"
      type="text"
      @input="$emit('update:value', $event.target.value)"
      @blur="$emit('blur')"
    />
  </div>
</template>

<script setup lang="ts">
import { SearchIcon } from '@heroicons/vue/outline';

withDefaults(
  defineProps<{
    value: string;
    placeholder?: string;
    inputClass?: string;
  }>(),
  {
    placeholder: 'Search',
    inputClass: 'text',
  }
);

defineEmits<{
  (e: 'update:value', value: string);
  (e: 'blur');
}>();
</script>
