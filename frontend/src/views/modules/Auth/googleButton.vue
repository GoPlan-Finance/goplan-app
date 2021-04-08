<template>
  <button
    class="flex items-center justify-center shadow-md hover:shadow-lg bg-blue-500 p-1 rounded-sm"
    @click="$emit('clicked')"
  >
    <img
      alt="Google logo"
      src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/8399/G-on-white.svg"
    >
    <span class="text-white px-8">Sign in with Google</span>
  </button>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  emits: [
    'clicked'
  ]
})
</script>
