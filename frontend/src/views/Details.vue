<template>
  <template v-if="!loading && assetSymbol">
    <div class="flex flex-wrap justify-between">
      <h1 class="text-gray-700 text-3xl font-bold mb-6">
        {{ assetSymbol.get('symbol').toUpperCase() }} - <small>{{ assetSymbol.get('name') }}</small>
      </h1>
      <div class="flex gap-2">
        <buy-sell-asset :asset-symbol="assetSymbol" />
        <WatchAssetModal :asset-symbol="assetSymbol" />
      </div>
    </div>

    <select @change="addToWatchlist($event)">
      <option
        selected
        value=""
      >
        ---
      </option>
      <option
        v-for="(watchlist, index) in watchlists"
        :key="index"
        :value="watchlist.id"
      >
        {{ watchlist.get('name') }}
      </option>
    </select>
    <br>

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
import {defineComponent, onBeforeMount, onUnmounted, reactive, toRefs, watch} from 'vue'
import CandlestickChart from '../components/Charts/CandlestickChart.vue'
import AssetPrice from '../components/AssetPrice.vue'
import {Currencies, Money} from 'ts-money'
import {AssetSymbol} from '../../../common/models'
import CompanyInfo from '../components/CompanyInfo.vue'
import BuySellAsset from '../components/BuySellAsset.vue'
import WatchAssetModal from '../components/WatchAssetModal.vue'


export default defineComponent({
  components: {
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
      data.assetSymbol = await AssetSymbol.findOneBy({
        symbol: props.ticker
      }) || null

      data.loading = false
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
