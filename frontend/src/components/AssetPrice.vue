<template>
  <div
    v-if="price"
    class="flex flex-wrap overflow-hidden p-6 mb-6 bg-white rounded-lg"
  >
    <div class="text-5xl font-bold">
      {{ formatCurrency(price.price , symbol.currency , false) }}
    </div>
    <div class="text-gray-400 font-bold">
      <!-- currency -->
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
      {{ formatCurrency(change , symbol.currency , false) }}
    </div>
  </div>
</template>

<script lang="ts">
import { AssetPrice, AssetSymbol } from '/common/models'
import { formatCurrency } from '/common/utils'
import { computed, onUnmounted, onBeforeMount, ref, defineComponent } from 'vue'


export default defineComponent({
  props: {
    symbol: {
      type     : AssetSymbol,
      required : true,
    },
  },
  setup (props) {

    let liveSubscription = null

    const price = ref(null)
    onBeforeMount(async () => {


      liveSubscription = await AssetPrice.liveQuery(props.symbol, assetPrice => {
        price.value = assetPrice
      })
    })

    onUnmounted(async () => {
      if (liveSubscription) {
        await liveSubscription.unsubscribe()
      }
    })


    const change = computed(() => (price.value ? (price.value.price - price.value.previousClose) : null))

    const changeIsPositive = computed(() => change.value >= 0)

    const percent = computed(() => (price.value ? ((change.value / price.value.price) * 100) : null))

    return {
      formatCurrency,
      price,
      change,
      percent,
      changeIsPositive,
    }
  },
})
</script>
