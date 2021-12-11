<template>
  <div class="flex flex-wrap gap-2">
    <label v-for="scale in timeScales" :key="scale.label">
      <input
        :value="scale.label"
        :checked="selected.label === scale.label"
        class="sr-only peer"
        name="radio"
        id="scale.label"
        type="radio"
        @change="$emit('change', scale)"
      />
      <span
        class="
          py-1
          px-4
          text-sm text-gray-700
          inline-flex
          items-center
          bg-gray-200
          rounded-xl
          cursor-pointer
          hover:bg-gray-300
          peer-checked:bg-gray-400
          select-none
        "
        >{{ scale.label }}</span
      >
    </label>
  </div>
</template>

<script setup lang="ts">
import {
  TimeScaleInterface,
  useTimeScales,
} from '@components/Charts/CandleStickChart/TimeScales/useTimeScales';

const { timeScales } = useTimeScales();

defineProps<{
  selected: TimeScaleInterface;
}>();
</script>
