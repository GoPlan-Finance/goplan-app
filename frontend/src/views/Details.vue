<template>
  <template v-if="!loading && assetSymbol">
    <HeadlineActions>
      <h1 class="text-gray-700 text-3xl font-bold mb-6">
        {{ assetSymbol.symbol.toUpperCase() }} - <small>{{ assetSymbol.name }}</small>
      </h1>
      <div class="flex gap-2">
        <buy-sell-asset :asset-symbol="assetSymbol" />
        <WatchAssetModal :asset-symbol="assetSymbol" />
      </div>
    </HeadlineActions>
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

    <div class="grid grid-cols-4 gap-4">
      <div>
        <CompanyQuote
          :asset-symbol="assetSymbol"
        />
      </div>
      <div
        class="col-span-3"
      >
        <CompanyInfo
          :asset-symbol="assetSymbol"
        />
      </div>
    </div>
  </template>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, reactive, toRefs, watch} from 'vue'
import CandlestickChart from '../components/Charts/CandlestickChart.vue'
import AssetPrice from '../components/AssetPrice.vue'
import {Currencies, Money} from 'ts-money'
import {AssetSymbol} from '../../../common/models'
import CompanyInfo from '../components/CompanyInfo.vue'
import BuySellAsset from '../components/BuySellAsset.vue'
import WatchAssetModal from '../components/WatchAssetModal.vue'
import CompanyQuote from '../components/CompanyQuote.vue'
import HeadlineActions from '../components/HeadlineActions.vue'

export default defineComponent({
  components: {
    CompanyQuote,
    HeadlineActions,
    WatchAssetModal,
    CompanyInfo,
    AssetPrice,
    CandlestickChart,
    BuySellAsset,
  },
  props: {
    ticker: {
      type     : String,
      required : true,
    }
  },
  setup (props) {
    const data: {
      loading: boolean,
      assetSymbol: AssetSymbol | null,
      currentPrice: Money,
      previousPrice: Money,
    } = reactive({
      loading       : false,
      assetSymbol   : null,
      currentPrice  : Money.fromDecimal(14, Currencies.USD),
      previousPrice : Money.fromDecimal(12, Currencies.USD),
    })

    const loadAssetSymbol = async () => {
      data.loading     = true
      data.assetSymbol = await AssetSymbol.fetchSymbolByTicker(props.ticker)
      data.loading     = false
    }

    watch(() => props.ticker, loadAssetSymbol)

    onBeforeMount(async () => {
      await loadAssetSymbol()
    })

    return {
      ...toRefs(data),
    }
  },
})


</script>
