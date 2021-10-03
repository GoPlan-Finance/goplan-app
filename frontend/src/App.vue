<template>
  <component :is="layout">
    <Suspense>
      <router-view />
    </Suspense>
  </component>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useRouter } from 'vue-router';

const defaultLayout = 'default';

export default defineComponent({
  setup() {
    const { currentRoute } = useRouter();

    const layout = computed(() => `${currentRoute.value.meta.layout || defaultLayout}-layout`);

    return {
      layout,
    };
  },
});
</script>
