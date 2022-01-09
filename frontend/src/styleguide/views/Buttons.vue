<template>
  <h1 class="text-gray-700 text-3xl font-bold mb-6">Buttons</h1>
  <ButtonDefault class="mb-4" label="Primary Button" />
  <ButtonDefault type="secondary" class="mb-4" label="Secondary Button" />
  <ButtonDefault class="mb-4" label="Button with Icon">
    <template #before>
      <svg
        class="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
        />
      </svg>
    </template>
  </ButtonDefault>
  <ButtonDefault class="mb-4" label="Button with Icon">
    <template #after>
      <svg
        class="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
        />
      </svg>
    </template>
  </ButtonDefault>
</template>

<script setup lang="ts">
import ButtonDefault from '@components/base/ButtonDefault.vue';
</script>
