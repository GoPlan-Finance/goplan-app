<template>
  <h1 class="text-gray-700 text-3xl font-bold mb-6">
    Buttons
  </h1>
  <ButtonDefault
    label="Primary Button"
    class="mb-4"
  />
  <ButtonDefault
    label="Secondary Button"
    :type="ButtonType.SECONDARY"
    class="mb-4"
  />
  <ButtonDefault
    label="Button with Icon"
    class="mb-4"
  >
    <template #before>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
    </template>
  </ButtonDefault>
  <ButtonDefault
    label="Button with Icon"
    class="mb-4"
  >
    <template #after>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
    </template>
  </ButtonDefault>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import ButtonDefault, {ButtonType} from '../../components/base/ButtonDefault.vue'


export default defineComponent({
  components: {ButtonDefault},
  setup () {
    return {
      ButtonType
    }
  }
})
</script>
