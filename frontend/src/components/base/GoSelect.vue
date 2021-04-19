<template>
  <select
    v-model="value"
    class="rounded"
  >
    <option
      v-for="option in options"
      :key="option.value"
      :value="option.value"
    >
      {{ option.label }}
    </option>
  </select>
</template>

<script lang="ts">

import { defineComponent, PropType, computed } from 'vue'

export type SelectOption = {
  value: string,
  label: string
}

export default defineComponent({
  props: {
    modelValue: {
      type     : String,
      required : true,
    },
    options: {
      type     : Array as PropType<SelectOption[]>,
      required : true
    },
  },
  emits: [
    'update:modelValue',
  ],
  setup (props, {emit}) {
    const value = computed({
      get () {
        return props.modelValue
      },
      set (value) {
        emit('update:modelValue', value)
      }
    })
    return {
      value
    }
  }
})
</script>
