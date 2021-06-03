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
    <PriceChange
      :compare-from="price.previousClose"
      :compare-to="price.price"
    />
    <PriceChange
      :compare-from="price.previousClose"
      :compare-to="price.price"
      :currency="symbol.currency"
      type="total"
    />
  </div>
</template>

<script lang="ts">
import { AssetPrice, AssetSymbol } from '/@common/models'
import { formatCurrency } from '/@common/utils'
import PriceChange from '/@components/PriceChange.vue'
import { computed, onUnmounted, onBeforeMount, ref, defineComponent } from 'vue'


export default defineComponent({
  components : {PriceChange},
  props      : {
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

    return {
      formatCurrency,
      price,
    }
  },
})
</script>
