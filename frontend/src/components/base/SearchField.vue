<template>
  <div
    class="relative"
  >
    <span class="absolute inset-y-0 left-0 pl-3 flex items-center">
      <SearchIcon
        class="h-5 w-5 text-gray-300"
      />
    </span>

    <input
      class="w-32 min-w-full max-w-full rounded-lg pl-10 pr-4 py-2 border-0 focus:border-blue-300 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50"
      placeholder="Search"
      type="text"
      :value="$props.modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    >
  </div>
</template>

<script lang="ts">

import {defineComponent} from 'vue'
import {SearchIcon} from '@heroicons/vue/outline'

export default defineComponent({
  components : {SearchIcon},
  props      : {
    modelValue: {
      type     : String,
      required : true
    }
  },
  emits: [
    'update:modelValue'
  ]
})
</script>
