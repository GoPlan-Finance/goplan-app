<template>
  <div class="relative bg-gray-100 rounded-2xl overflow-hidden h-6">
    <div class="absolute left-0 top-0 bottom-0 bg-blue-600" :style="{ width: percent + '%' }"></div>
    <div class="absolute ml-2 text-sm text-white">{{ percent }}%</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  percent: number;
}>();
</script>
