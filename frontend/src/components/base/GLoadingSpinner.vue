<template>
  <div class="flex justify-center items-center">
    <div
      class="absolute inline-block rounded-full border-gray-200"
      :class="size ?? 'w-8 h-8 border-4'"
      role="status"
    ></div>
    <div
      class="animate-spin inline-block rounded-full border-white"
      :class="size ?? 'w-8 h-8  border-4'"
      style="border-top-color: transparent; border-right-color: transparent"
      role="status"
    ></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  size?: string;
}>();
</script>
