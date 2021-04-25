<template>
  <template v-if="!loading ">
    <HeadlineActions>
      <template #headline>
        <div class="flex flex-col">
          <div>
          </div>
          <div class="text-base text-gray-500 font-medium">

          </div>
        </div>
      </template>
      <template #default>
        <buy-sell-asset/>
      </template>
    </HeadlineActions>
    <div class="grid grid-cols-1 md:grid-cols-2">

    </div>
    <div class="rounded-lg bg-white overflow-hidden p-6 mb-6">

      <HoldingTimeSeriesChart
      >

      </HoldingTimeSeriesChart>
    </div>

    <div class="grid grid-cols-4 gap-4">
      <div>

      </div>
      <div
        class="col-span-3"
      >

      </div>
    </div>
  </template>
</template>

<script lang="ts">
import AssetPriceVue from '/@components/AssetPrice.vue'
import BuySellAsset from '/@components/BuySellAsset.vue'
import CandlestickChart from '/@components/Charts/CandlestickChart.vue'
import HoldingTimeSeriesChart from '/@components/Charts/HoldingTimeSeriesChart.vue'
import CompanyInfo from '/@components/CompanyInfo.vue'
import CompanyQuote from '/@components/CompanyQuote.vue'
import HeadlineActions from '/@components/HeadlineActions.vue'
import WatchAssetModal from '/@components/WatchAssetModal.vue'
import { defineComponent, onBeforeMount, onUnmounted } from 'vue'


export default defineComponent({
  components : {
    HoldingTimeSeriesChart,
    CompanyQuote,
    HeadlineActions,
    WatchAssetModal,
    CompanyInfo,
    AssetPrice : AssetPriceVue,
    CandlestickChart,
    BuySellAsset,
  },
  props      : {},
  setup (props) {


    onBeforeMount(async () => {
    })

    onUnmounted(async () => {

    })

    return {
      loading : false,
    }
  },
})


</script>
