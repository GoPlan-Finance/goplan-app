<template>
  <button
    :class="{
      'text-blue-600 bg-blue-200 hover:bg-blue-300': type === ButtonType.PRIMARY,
      'text-gray-600 bg-gray-300 hover:bg-gray-400': type === ButtonType.SECONDARY,
    }"
    :disabled="disabled"
    class="inline-flex items-center gap-2 px-6 py-2 rounded-lg font-bold tracking-wide disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-default"
    @click="$emit('click', $event)"
  >
    <slot name="before" />
    <slot>
      {{ label }}
    </slot>
    <slot name="after" />
  </button>
</template>

<script setup lang="ts">
import { ButtonType } from '@/types';

const props = withDefaults(
  defineProps<{
    label: string;
    type?: ButtonType;
    disabled?: true;
  }>(),
  {
    type: ButtonType.PRIMARY,
  }
);

const emit = defineEmits<{
  (e: 'click'): void;
}>();
</script>
