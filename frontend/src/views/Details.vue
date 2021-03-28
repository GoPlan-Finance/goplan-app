<template>
  <template v-if="!loading && assetSymbol">
    <h1 class="text-gray-700 text-3xl font-bold mb-6">
      {{ assetSymbol.get('symbol').toUpperCase() }} - <small>{{ assetSymbol.get('name') }}</small>
    </h1>

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
import {Watchlist} from '../../../common/models/Watchlist'


export default defineComponent({
  components: {
    CompanyInfo,
    AssetPrice,
    CandlestickChart
  },
  props: {
    ticker: {
      type: String,
    }
  },
  setup (props) {
    let liveSubscription = null

    const data: {
      loading: boolean,
      assetSymbol: AssetSymbol | null,
      currentPrice: Money,
      previousPrice: Money,
      watchlists: Watchlist[],
    } = reactive({
      loading       : false,
      assetSymbol   : null,
      currentPrice  : Money.fromDecimal(14, Currencies.USD),
      previousPrice : Money.fromDecimal(12, Currencies.USD),
      watchlists    : [],
    })

    const loadAssetSymbol = async () => {
      data.loading     = true
      data.assetSymbol = await AssetSymbol.findOneBy( {
        symbol: props.ticker
      }) || null

      data.loading = false
    }

    const addToWatchlist = async event => {
      const selected = event.target.value
      if (!selected) {
        return
      }

      const watchlist = data.watchlists.find(w => w.id === selected)

      watchlist.relation('symbols').add(data.assetSymbol)
      await watchlist.save()
      alert('added')
    }

    watch(() => props.ticker, loadAssetSymbol)

    onBeforeMount(async () => {
      await loadAssetSymbol()

      const q = new Parse.Query(Watchlist)

      liveSubscription = await Watchlist.liveQuery(q, data.watchlists)
    })

    onUnmounted(async () => {
      if (liveSubscription) {
        await liveSubscription.unsubscribe()
      }
    })
    return {
      ...toRefs(data),
      addToWatchlist,
    }
  },
})


</script>
