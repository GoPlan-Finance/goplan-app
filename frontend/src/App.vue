<template>
  <NotificationDisplay />
  <component :is="layout">
    <Suspense>
      <RouterView :key="$route.fullPath" />
      <template #fallback>
        <GLoadingSpinner size="w-20 h-20 border-8" />
      </template>
    </Suspense>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import GLoadingSpinner from '@components/base/GLoadingSpinner.vue';
import NotificationDisplay from '@components/NotificationDisplay.vue';

const defaultLayout = 'default';

const route = useRoute();

const layout = computed(() => `${route.meta.layout || defaultLayout}-layout`);
</script>
