<template>
  <label>
    <div v-if="label" class="text-gray-400 ml-2 mb-1">{{ label }}</div>
    <slot />
    <div class="text-red-600" v-if="error">{{ error }}</div>
  </label>
</template>

<script setup lang="ts">
const props = defineProps<{
  label?: string;
  error?: string;
}>();
</script>
