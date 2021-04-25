<template>
  <component :is="icon"></component>
</template>

<script>
import {defineAsyncComponent} from "vue";

export default {
  name: "GoIcons",
  props: {
    name:{
      type: String,
      required: true,
      validator: (val) => ['Pencil'].includes(val)
    },
    type:{
      type: String,
      default: 'solid'
    }
  },
  computed: {
    icon () {
      return defineAsyncComponent(() =>
        import(`/node_modules/@heroicons/vue/${this.type}/esm/${this.name}Icon.js`)
      )
    }
  }
}
</script>
