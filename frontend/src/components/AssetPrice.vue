<template>
  <div class="flex flex-wrap overflow-hidden p-6 mb-6 bg-white rounded-lg">
    <div class="text-5xl font-bold">
      {{ currentPrice.toDecimal().toFixed(2) }}
    </div>
    <div class="text-gray-400 font-bold">
      {{ currentPrice.getCurrency() }}
    </div>
    <div
      :class="changeIsPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
      class="p-3 ml-3 text-xl rounded-lg font-bold"
    >
      <span v-if="changeIsPositive">+</span> {{ percent.toFixed(2) }} %
    </div>
    <div
      :class="changeIsPositive ? 'text-green-800' : 'text-red-800'"
      class="flex items-center p-3 ml-3 text-xl rounded-lg font-bold"
    >
      <svg
        :class="changeIsPositive ? '' : 'transform rotate-180'"
        class="mr-1"
        fill="none"
        height="24"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="3"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          x1="12"
          x2="12"
          y1="19"
          y2="5"
        />
        <polyline points="5 12 12 5 19 12" />
      </svg>
      {{ change.toDecimal().toFixed(2) }}
    </div>
  </div>
</template>

<script lang="ts">
import { Money } from 'ts-money'
import { computed, defineComponent } from 'vue'


export default defineComponent({
  props: {
    currentPrice: {
      type     : Money,
      required : true,
    },
    previousPrice: {
      type    : Money,
      default : null,
    },
  },
  setup (props) {
    const change = computed(() => props.currentPrice.subtract(props.previousPrice))

    const changeIsPositive = computed(() => change.value.toDecimal() >= 0)

    const percent = computed(() => (change.value.getAmount() / props.currentPrice.getAmount()) * 100)

    return {
      change,
      percent,
      changeIsPositive,
    }
  },
})
</script>
