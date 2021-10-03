<template>
  <router-link
    :class="[$route.name === title ? activeClass : inactiveClass]"
    :to="to"
    class="flex items-center duration-200 mt-2 mx-4 py-2 px-6 rounded-lg"
  >
    <slot />

    <span class="mx-4">
      {{ title }}
    </span>
  </router-link>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  props: {
    title: {
      type: String,
      default: '',
    },
    to: {
      type: String,
      default: '',
    },
  },
  setup() {
    const activeClass = ref('bg-gray-600 bg-opacity-25 text-white border-gray-100');
    const inactiveClass = ref(
      'text-gray-500 hover:bg-gray-600 hover:bg-opacity-25 hover:text-white'
    );

    return {
      activeClass,
      inactiveClass,
    };
  },
});
</script>
