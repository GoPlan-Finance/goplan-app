<template>
  <component :is="layout">
    <Suspense>
      <RouterView :key="$route.fullPath" />
    </Suspense>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const defaultLayout = 'default';

const route = useRoute();

const layout = computed(() => `${route.meta.layout || defaultLayout}-layout`);
</script>
