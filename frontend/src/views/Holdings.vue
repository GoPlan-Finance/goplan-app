<template>
  <HeadlineActions
    :headline="$t('holdings.headline')"
  >
    <buy-sell-asset />
  </HeadlineActions>

  <template
    v-for="openOrClose in ['open','closed']"
    :key="openOrClose"
  >
    <h1 class="text-gray-700 text-2xl  items-center">
      {{ openOrClose.charAt(0).toUpperCase() + openOrClose.substring(1) }} Positions
    </h1>

    <DataTable
      :config="config"
      :rows="rows[openOrClose]"
    >
      <!--Copied from Transactions.vue-->
      <template
        #field(ticker)="{ row }"
      >
        <AppLink
          v-if="row.symbol"
          :ticker="row.symbol.symbol"
          class="font-bold"
          to="ticker_details"
        >
          <p class="mr-3 font-bold">
            {{ row.symbol.symbol }}
          </p>
        </AppLink>
        <span v-else-if="row.symbolName">
          {{ row.symbolName }}
        </span>
        <span v-else>
        <!--N/A-->
        </span>
      </template>

      <template
        #field(symbol)="{value, row }"
      >
        <AppLink
          v-if="value"
          :ticker="value.symbol"
          class="font-bold"
          to="ticker_details"
        >
          <p class="font-normal text-sm">
            {{ value.name }}
          </p>
        </AppLink>
        <span v-else-if="row.symbolName">
          {{ row.symbolName }}
        </span>
        <span v-else>
          N/A
        </span>
      </template>


      <template
        #field(openPL)="{ row}"
      >
        <template v-if="openOrClose === 'open' && row.openQty !== 0">
          <AssetPriceChange
            v-if="row.lastPrice"
            :compare-from="row.openQty * row.openAvgPrice"
            :compare-to=" row.openQty * row.lastPrice.price"
          />
        </template>
      </template>

      <template
        #field(dayPLChange)="{ row}"
      >
        <AssetPriceChange
          v-if="row.lastPrice"
          :compare-from="row.openQty * row.lastPrice.previousClose"
          :compare-to=" row.openQty * row.lastPrice.price"
        />
      </template>
    </DataTable>
  </template>
</template>

<script lang="ts">

import { Holding } from '/common/models/Holding'
import { formatCurrency } from '/common/utils'
import * as dayjs from 'dayjs'
import { defineComponent, reactive, ref, toRefs, watch } from 'vue'
import AssetPriceChange from '../components/AssetPriceChange.vue'
import BuySellAsset from '../components/BuySellAsset.vue'
import DataTable from '../components/DataTable.vue'
import HeadlineActions from '../components/HeadlineActions.vue'
import AppLink from '../components/router/AppLink.vue'
import { useAssetPriceStore, useHoldingStore } from '../store'


export default defineComponent({
  components: {
    AssetPriceChange,
    BuySellAsset,
    HeadlineActions,
    DataTable,
    AppLink,
  },
  setup () {
    const totalOpen = ref(0)

    const data = reactive({
      rows: {
        open   : [],
        closed : [],
      },
      config: {
        fields: {
          symbol: {
            // sortKey: 'name'
          },
          ticker: {
            // sortKey: 'symbol'
          },
          dayPLChange : {},
          dayPL       : {
            format: (value, row : Holding) => {
              if (!row.lastPrice) {
                return ''
              }

              return formatCurrency((row.lastPrice.previousClose - row.lastPrice.price) * row.openQty, row.currency, true)
            },
          },

          currentTotalPrice: {
            format: (value, row : Holding) => {
              if (!row.lastPrice) {
                return ''
              }

              return formatCurrency(row.lastPrice.price * row.openQty, row.currency, true)
            },
          },
          currentAvgPrice: {
            format: (value, row : Holding) => {
              if (!row.lastPrice) {
                return ''
              }

              return formatCurrency(row.lastPrice.price, row.currency)
            },
          },
          //
          openQty: {
            format: value => (value !== 0 ? value : ''),
          },
          lastBuy: {
            format: 'date'
          },
          openTotalPrice: {
            private : true,
            format  : 'currency',
          },
          openAvgPrice: {
            format: 'money',
          },
          //
          closedQty: {
            format: value => (value !== 0 ? value : ''),
          },
          closedAvgPrice: {
            format: 'money',
          },
          closedTotalPrice: {
            private : true,
            format  : 'currency',
          },
          //
          openPL   : {},
          closedPL : {},
          weight   : {
            format: (value, row) => {
              return  totalOpen.value !== 0 ? `${((100 * row.openQty * row.openAvgPrice) / totalOpen.value).toFixed(1)} %` : ''
            },
          },
        },
        headerLayout: [
          [
            'ticker', 'symbol',
          ],
          [
            'openQty',  'lastBuy'
          ],
          [
            'openTotalPrice', 'openAvgPrice',
          ],
          [
            'currentTotalPrice', 'currentAvgPrice',
          ],
          [
            'openPL', /* 'openTotalPrice',*/
          ],
          [
            'dayPLChange', /*'dayPL',*/
          ],
          'weight',
        ],
        settings: {
          actions           : false,
          translationPrefix : 'holdings.table',
        },


        search: {
          handler: (searchString, holding) => {
            const searchVal  = searchString.toLowerCase()
            const tickerName = holding.symbolName

            if (tickerName && tickerName.toLowerCase().startsWith(searchVal)) {
              return true
            }

            // noinspection RedundantIfStatementJS
            if (holding.symbol
                && (
                  holding.symbol.name.toLowerCase().includes(searchVal)
                )
            ) {
              return true
            }

            return false
          },
        },
      },
    })


    const holdingStore = useHoldingStore()
    const priceStore   = useAssetPriceStore()

    holdingStore.subscribe()

    watch(() => holdingStore.holdings, () => {
      const rows : Holding[] = holdingStore.holdings

      totalOpen.value = holdingStore.holdings.reduce((result, holding) => {

        return result + (holding.openQty * holding.openAvgPrice)  // @todo this doesnt calculate actual current %, but open%

      }, 0)


      data.rows.open   = rows.filter(row => row.openQty !== 0)
      data.rows.closed = rows.filter(row => row.openQty === 0)
    }, {})


    return {
      ...toRefs(data),
      dayjs,
    }
  },
})
</script>
