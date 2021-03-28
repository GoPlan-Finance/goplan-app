<template>
  <div class="flex flex-wrap overflow-hidden p-6 mb-6 bg-white rounded-lg">
    <div class="text-5xl font-bold">
      {{ currentPrice.toDecimal().toFixed(2) }}
    </div>
    <div class="text-gray-400 font-bold">
      {{ currentPrice.getCurrency() }}
    </div>
    <div
      class="p-3 ml-3 text-xl rounded-lg font-bold"
      :class="changeIsPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
    >
      <span v-if="changeIsPositive">+</span> {{ percent.toFixed(2) }} %
    </div>
    <div
      class="flex items-center p-3 ml-3 text-xl rounded-lg font-bold"
      :class="changeIsPositive ? 'text-green-800' : 'text-red-800'"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="mr-1"
        :class="changeIsPositive ? '' : 'transform rotate-180'"
      >
        <line
          x1="12"
          y1="19"
          x2="12"
          y2="5"
        />
        <polyline points="5 12 12 5 19 12" />
      </svg>
      {{ change.toDecimal().toFixed(2) }}
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, toRef} from 'vue'
import {Money} from 'ts-money'

export default defineComponent({
  props: {
    currentPrice: {
      type     : Money,
      required : true
    },
    previousPrice: {
      type    : Money,
      default : null
    },
  },
  setup (props) {
    const change = computed(() => props.currentPrice.subtract(props.previousPrice))

    const changeIsPositive = computed(() => change.value.toDecimal() >= 0)

    const percent = computed(() => (change.value.getAmount() / props.currentPrice.getAmount()) * 100)

    return {
      change,
      percent,
      changeIsPositive
    }
  }
})
</script>
