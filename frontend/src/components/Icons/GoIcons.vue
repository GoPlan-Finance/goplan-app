<template>
  <component :is="icon"></component>
</template>

<script>
import { defineAsyncComponent, defineComponent } from 'vue'
import { icons } from './icons'

export default defineComponent({
  props: {
    name:{
      type: String,
      required: true,
      validator: value => Object.values(icons).includes(value)
    },
    type:{
      type: String,
      default: 'solid',
      validator: value => value === 'solid' || value === 'outline'
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
