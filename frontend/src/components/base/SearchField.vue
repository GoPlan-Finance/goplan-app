<template>
  <div
    class="relative"
  >
    <span class="absolute inset-y-0 left-0 pl-3 flex items-center">
      <GoIcons
        name="Search"
        class="h-5 w-5 text-gray-300"
      />
    </span>

    <input
      :class="inputClass"
      :value="$props.modelValue"
      class="w-100 min-w-full max-w-full rounded pl-10 pr-4 py-2 border-0 focus:border-blue-300 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50"
      :placeholder="placeholder"
      type="text"
      @input="$emit('update:modelValue', $event.target.value)"
    >
  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue'


export default defineComponent({
  props: {
    modelValue: {
      type     : String,
      required : true,
    },
    placeholder: {
      type    : String,
      default : 'Search',
    },
    inputClass: {
      type    : String,
      default : '',
    },
  },
  emits: [
    'update:modelValue',
  ],
})
</script>
