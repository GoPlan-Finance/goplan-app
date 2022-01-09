<template>
  <h1 class="text-gray-700 text-3xl font-bold mb-6">Modals</h1>
  <Modal title="Modal Title goes here">
    <template #button>
      <ButtonDefault label="Open Modal" />
    </template>
    <template #content> Modal Content goes here </template>
  </Modal>
</template>

<script setup lang="ts">
import ButtonDefault from '@components/base/ButtonDefault.vue';
import Modal from '@components/base/GoModal.vue';
</script>
