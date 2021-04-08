<template>
  <div class="flex flex-wrap overflow-hidden p-6 mb-6 bg-white rounded-lg">
    <DataField
      v-for="(detail, index) in data.details"
      :key="index"
      :data="detail.data"
      :label="$t('quote.' + detail.label)"
      :type="detail.type"
      class="mb-2"
    />
  </div>
</template>

<script lang="ts">
import { AssetSymbol } from '/common/models'
import { defineComponent, onBeforeMount, reactive } from 'vue'
import { CompanyQuote } from '../../backend/src/cloud/DataProviders/providers/types' // @todo
import DataField from './base/DataField.vue'


export default defineComponent({
  components : {DataField},
  props      : {
    assetSymbol: {
      type     : AssetSymbol,
      required : true,
    },
  },
  setup (props) {

    const data = reactive({
      info    : {},
      details : [],
    })

    onBeforeMount(async () => {

      const info : CompanyQuote = await Parse.Cloud.run('Assets--GetQuote', {
        assetSymbolId: props.assetSymbol.id,
      })

      data.info = info

      data.details = [
        {
          type  : 'money',
          label : 'open',
          data  : info.open,
        },
        {
          type  : 'money',
          label : 'previousClose',
          data  : info.previousClose,
        },
        {
          type  : 'percent',
          label : 'change_percent',
          data  : info.changesPercentage,
        },
        {
          type  : 'moneyChange',
          label : 'change',
          data  : info.change,
        },
        {
          type  : 'moneyRange',
          label : 'dayRange',
          data  : [
            info.dayLow, info.dayHigh,
          ],
        },
        {
          type  : 'moneyRange',
          label : 'yearRange',
          data  : [
            info.yearLow, info.yearHigh,
          ],
        },
        {
          type  : 'number',
          label : 'marketCap',
          data  : info.marketCap,
        },
        {
          type  : 'money',
          label : 'priceAvg50',
          data  : info.priceAvg50,
        },
        {
          type  : 'money',
          label : 'priceAvg200',
          data  : info.priceAvg200,
        },
        {
          type  : 'number',
          label : 'volume',
          data  : info.volume,
        },
        {
          type  : 'number',
          label : 'avgVolume',
          data  : info.avgVolume,
        },
        {
          label : 'exchange',
          data  : info.exchange,
        },
        {
          type  : 'number',
          label : 'eps',
          data  : info.eps,
        },
        {
          type  : 'number',
          label : 'pe',
          data  : info.pe,
        },
        {
          type  : 'date',
          label : 'earningsAnnouncement',
          data  : info.earningsAnnouncement,
        },
        {
          type  : 'number',
          label : 'sharesOutstanding',
          data  : info.sharesOutstanding,
        },

      ]
    })

    return {
      data,
    }
  },
})
</script>
