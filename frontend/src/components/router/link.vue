<template>
  <router-link :to="{name: props.to , params: attrs }">
    <slot></slot>
  </router-link>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue'

export default defineComponent({
  props: {
    to: {
      type: String,
      required: true
    },
    // params: {
    //   type: Object,
    //   default: () => {
    //   }
    // },
  },
  setup(props, {attrs}) {
    return {
      props,
      attrs
    }
  }
})
</script>
