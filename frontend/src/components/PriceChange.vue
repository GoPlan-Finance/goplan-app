<template>
  <div
    v-if="compareTo && compareFrom"
    class="flex flex-wrap overflow-hidden"
  >
    <div
      v-if="type === 'percentage'"
      :class="[
        isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
      ]"
      class="rounded-lg p-1 ml-1"
    >
      <span v-if="isPositive">+</span><span v-else>-</span> {{ percent.toFixed(2) }} %
    </div>
    <div
      v-if="type === 'total'"
      :class="[
        isPositive ? 'text-green-800' : 'text-red-800',
      ]"
      class="flex items-center rounded-lg"
    >
      <Private>
        <span v-if="isPositive">+</span> {{ formatCurrency(total, currency, true) }}
      </Private>
    </div>
  </div>
</template>

<script lang="ts">
import { formatCurrency } from '/@common/utils'
import { computed, defineComponent } from 'vue'


export default defineComponent({
  props: {
    compareFrom: {
      type     : Number,
      required : true,
    },
    compareTo: {
      type     : Number,
      required : true,
    },
    currency: {
      type     : String,
      required : false,
    },
    type: {
      type      : String,
      default   : 'percentage',
      validator : value => {
        return [
          'percentage',
          'total',
        ].includes(value)
      },
    }
  },
  setup (props) {
    const total      = computed(() => props.compareTo - props.compareFrom)
    const isPositive = computed(() => total.value >= 0)
    const percent    = computed(() => (total.value / props.compareFrom) * 100)

    return {
      total,
      percent,
      isPositive,
      formatCurrency
    }
  },
})
</script>
