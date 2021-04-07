<template>
  <div class="flex flex-wrap justify-between mb-8 gap-4">
    <h1 class="text-gray-700 text-2xl font-bold flex items-center">
      <slot name="headline">
        {{ headline }}
      </slot>
    </h1>
    <div class="flex gap-2">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  props: {
    headline: {
      type    : String,
      default : ''
    }
  }
})
</script>
