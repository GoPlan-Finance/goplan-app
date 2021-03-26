<template>
  <template v-if="!loading && assetSymbol">
    <h1 class="text-gray-700 text-3xl font-bold mb-6">
      {{ assetSymbol.get('symbol').toUpperCase() }} - <small>{{ assetSymbol.get('name') }}</small>
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-2">
      <AssetPrice
        :current-price="currentPrice"
        :previous-price="previousPrice"
      />
    </div>
    <div class="rounded-lg bg-white overflow-hidden p-6 mb-6">
      <CandlestickChart
        :asset-symbol="assetSymbol"
      />
    </div>
    <CompanyInfo
      :asset-symbol="assetSymbol"
    />
  </template>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, onMounted,watch} from 'vue'
import {useRoute} from 'vue-router'
import CandlestickChart from '../components/Charts/CandlestickChart.vue'
import AssetPrice from '../components/AssetPrice.vue'
import {findOneBy} from '../../../common/models/objectUtils'
import {Currencies, Money} from 'ts-money'
import {AssetSymbol} from '../../../common/models'
import CompanyInfo from '../components/CompanyInfo.vue'


export default defineComponent({
  components: {
    CompanyInfo,
    AssetPrice,
    CandlestickChart
  },

  setup() {
    const route = useRoute()

    const data: {
      loading: boolean,
      assetSymbol: AssetSymbol | null,
      currentPrice: Money,
      previousPrice: Money,
    } = reactive({
      loading: false,
      assetSymbol: null,
      currentPrice: Money.fromDecimal(14, Currencies.USD),
      previousPrice: Money.fromDecimal(12, Currencies.USD)
    })

    const loadAssetSymbol = (async () => {
      data.loading     = true
      data.assetSymbol = await findOneBy('AssetSymbol', {
        symbol: route.params.ticker as string
      }) || null

      data.loading = false
    })

    watch(() => route.params, loadAssetSymbol)

    onMounted( async () => {
    await loadAssetSymbol()
    })

    return {
      ...toRefs(data),
    }
  },
})


</script>
