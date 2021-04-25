<template>
  <component :is="icon"></component>
</template>

<script>
import { defineAsyncComponent, defineComponent } from 'vue'

export default defineComponent({
  props: {
    name:{
      type: String,
      required: true,
    },
    type:{
      type: String,
      default: 'solid'
    }
  },
  setup(props) {
    return {
      icon: defineAsyncComponent(() =>
        import(`/node_modules/@heroicons/vue/${props.type}/esm/${props.name}Icon.js`)
      )
    }
  }
})
</script>
