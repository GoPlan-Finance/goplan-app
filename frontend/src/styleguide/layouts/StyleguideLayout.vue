<template>
  <div class="flex h-screen bg-gray-200">
    <StyleguideSidebar />

    <div class="flex-1 flex flex-col overflow-hidden">
      <main class="flex-1 overflow-x-hidden overflow-y-auto">
        <div class="xl:container mx-auto px-6 py-8">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import StyleguideSidebar from '../components/StyleguideSidebar.vue';

export default defineComponent({
  components: { StyleguideSidebar },
});
</script>
