<template>
  <template v-if="!loading">
    <h1 class="text-gray-700 text-3xl font-bold mb-6">
      {{ assetSymbol.get('symbol').toUpperCase() }} - <small>{{ assetSymbol.get('name') }}</small>
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
        v-if="assetSymbol"
        :asset-symbol="assetSymbol"
      />
    </div>
  </template>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, watch} from 'vue'
import {useRoute} from 'vue-router'
import CandlestickChart from '../components/Charts/CandlestickChart.vue'
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
      loading     : false,
      assetSymbol : null
    })

    const load = (async () => {
      data.loading     = true
      data.assetSymbol = await findOneBy('AssetSymbol', {
        symbol: route.params.ticker as string
      })

      data.loading = false
    })

    watch(() => route.params, load)
    await load()


    return {
      ...toRefs(data),
    }
  },
})


</script>
