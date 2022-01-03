<template>
  <template v-if="privateMode && hide"> ***** </template>
  <template v-else>
    <slot />
  </template>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store';
import { computed } from 'vue';

const props = defineProps<{
  hide?: true;
}>();

const userStore = useUserStore();

const privateMode = computed(() => userStore.privateMode);
</script>
