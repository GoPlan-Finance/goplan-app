<template>
  <div class="flex h-screen bg-gray-200">
    <Sidebar />

    <div class="flex-1 flex flex-col overflow-hidden">
      <Header />

      <main class="flex-1 overflow-x-hidden overflow-y-auto">
        <div class="xl:container mx-auto px-6 py-8">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Header from '../components/Header.vue'
import Sidebar from '../components/Sidebar.vue'


export default defineComponent({
  components: {
    Header,
    Sidebar,
  },
})
</script>
