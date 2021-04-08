<template>
  <h1 class="text-gray-700 text-3xl font-bold mb-6">
    Modals
  </h1>
  <Modal
    title="Modal Title goes here"
  >
    <template #button>
      <ButtonDefault
        label="Open Modal"
      />
    </template>
    <template #content>
      Modal Content goes here
    </template>
  </Modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ButtonDefault, { ButtonType } from '../../components/base/ButtonDefault.vue'
import Modal from '../../components/Modal.vue'


export default defineComponent({
  components: {Modal, ButtonDefault},
  setup () {
    return {
      ButtonType,
    }
  },
})
</script>
