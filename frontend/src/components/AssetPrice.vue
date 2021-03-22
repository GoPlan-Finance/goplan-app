<template>
  <div class="flex flex-wrap overflow-hidden p-6 mb-6 bg-white rounded-lg">
    <div class="text-5xl font-bold">
      {{ price }}
    </div>
    <div class="p-3 ml-3 text-xl text-green-800 bg-green-100 rounded-lg">
      + {{ percent }} %
    </div>
    <div class="flex items-center p-3 ml-3 text-xl text-green-800 rounded-lg">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="mr-1"
      ><line
        x1="12"
        y1="19"
        x2="12"
        y2="5"
      /><polyline points="5 12 12 5 19 12" /></svg>
      {{ increase }}
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  props: {
    price: {
      type     : Number,
      required : true
    },
    increase: {
      type     : Number,
      required : true
    },
    percent: {
      type     : Number,
      required : true
    },
  },
  setup (props) {
    return {
      ...props
    }
  }
})
</script>
