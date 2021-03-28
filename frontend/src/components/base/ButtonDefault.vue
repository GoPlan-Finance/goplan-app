<template>
  <button
    class="flex gap-2 px-6 py-3 bg-blue-300 rounded-lg text-blue-600 font-bold tracking-wide hover:bg-blue-400"
    @click="$emit('click', $event)"
  >
    <slot
      name="before"
    />{{ label }}<slot
      name="after"
    />
  </button>
</template>

<script lang="ts">
import {defineComponent} from 'vue'


export default defineComponent({
  props: {
    label: {
      type     : String,
      required : true,
    },
  },
  emits: [
    'click'
  ],
})
</script>