<template>
  <div class="relative">
    <slot name="button" :toggle="toggleDropdown" />
    <div
      v-show="dropdownOpen"
      class="fixed inset-0 h-full w-full z-10"
      @click="dropdownOpen = false"
    />
    <div
      v-show="dropdownOpen"
      class="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl z-20"
    >
      <slot :toggle="toggleDropdown" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const dropdownOpen = ref(false);

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};
</script>
