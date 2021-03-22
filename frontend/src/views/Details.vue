<template>
  <h1 class="text-gray-700 text-3xl font-bold mb-6">
    {{ data.assetSymbol.get('symbol').toUpperCase() }} - <small>{{ data.assetSymbol.get('name') }}</small>
  </h1>

  <div class="grid grid-cols-1 md:grid-cols-2">
    <AssetPrice
      :increase="0.5"
      :percent="1.2"
      :price="121.1"
    />
  </div>
  <div class="rounded-lg bg-white overflow-hidden p-6 mb-6">
    <CandlestickChart
      :asset-symbol="data.assetSymbol"
    />
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, reactive, watch} from 'vue'
import {useRoute} from 'vue-router'
import CandlestickChart, {CandlestickSeries} from '../components/Charts/CandlestickChart.vue'
import AssetPrice from '../components/AssetPrice.vue'
import {findOneBy} from '../../../common/models/objectUtils'

export default defineComponent({
  components: {
    AssetPrice,
    CandlestickChart
  },

  async setup () {
    const route = useRoute()

    const data = reactive({
      assetSymbol: null
    })
    const load = async () => {
      data.assetSymbol = await findOneBy('AssetSymbol', {
        symbol: route.params.ticker as string
      })

    }

    watch(() => route.params, load)
    await load()


    return {
      data,
    }
  },
})

</script>
