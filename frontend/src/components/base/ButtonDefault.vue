<template>
  <button
    :disabled="$props.disabled"
    class="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold tracking-wide disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-default"
    :class="{
      'text-blue-600 bg-blue-200 hover:bg-blue-300': type === ButtonType.PRIMARY,
      'text-gray-600 bg-gray-300 hover:bg-gray-400': type === ButtonType.SECONDARY,
    }"
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
import {defineComponent, toRefs} from 'vue'

export enum ButtonType {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
}

export default defineComponent({
  props: {
    label: {
      type     : String,
      required : true,
    },
    type: {
      type    : String,
      default : ButtonType.PRIMARY
    },
    disabled: {
      type    : Boolean,
      default : false,
    }
  },
  emits: [
    'click'
  ],
  setup (props) {
    return {
      ...toRefs(props),
      ButtonType
    }
  }
})
</script>
