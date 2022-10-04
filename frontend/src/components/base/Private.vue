<template>
  <template v-if="state.privateMode && hide"> ***** </template>
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

const { state } = useUserStore();
</script>
