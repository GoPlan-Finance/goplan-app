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
        #field(symbolName)="{ value , row }"
      >
        <AppLink
          v-if="row.symbol"
          :ticker="row.symbolName"
          class="font-bold"
          to="ticker_details"
        >
          <p class="mr-3 font-bold">
            {{ value }}
          </p>
        </AppLink>
        <span v-else>
          {{ value }}
        </span>
      </template>

      <template
        #field(name)="{value, row }"
      >
        <AppLink
          v-if="row.symbol"
          :ticker="row.symbolName"
          class="font-bold"
          to="ticker_details"
        >
          <p class="font-normal text-sm">
            {{ value }}
          </p>
        </AppLink>
        <span v-else>
          {{ value }}
        </span>
      </template>


      <template
        #field(openPL)="{ row }"
      >
        <template
          v-if="openOrClose === 'open'"
        >
          <AssetPriceChange
            v-if="row.openQty !== 0 && row.lastPrice"
            :compare-from="row.openQty * row.openAvgPrice"
            :compare-to=" row.openQty * row.lastPrice.price"
          />

          <span v-else>
            --
          </span>
        </template>

        <template
          v-if="openOrClose === 'closed'"
        >
          <AssetPriceChange
            :compare-from="row.buyTotalPrice"
            :compare-to=" row.closedTotalPrice"
          />
        </template>
      </template>

      <template
        #field(dayPLChange)="{ row}"
      >
        <AssetPriceChange
          v-if="row.lastPrice"
          :compare-from="(openOrClose === 'close' ?row.openQty : 1) * row.lastPrice.previousClose"
          :compare-to=" (openOrClose === 'close' ?row.openQty : 1)* row.lastPrice.price"
        />
        <span v-else>
          --
        </span>
      </template>

      <template
        #field(overallPL)="{ row }"
      >
        <AssetPriceChange
          v-if="row.lastPrice"
          :compare-from="row.buyQty * row.buyAvgPrice"
          :compare-to="(row.openQty * row.lastPrice.price) + ( row.closedQty * row.closedAvgPrice)"
        />
        <span v-else>
          --
        </span>
      </template>
    </DataTable>
  </template>
</template>

<script lang="ts">

import { Holding } from '/@common/models/Holding'
import AssetPriceChange from '/@components/AssetPriceChange.vue'
import BuySellAsset from '/@components/BuySellAsset.vue'
import DataTable from '/@components/DataTable.vue'
import HeadlineActions from '/@components/HeadlineActions.vue'
import AppLink from '/@components/router/AppLink.vue'
import { Screens } from '/@utils/screens'
import * as dayjs from 'dayjs'
import { defineComponent, onBeforeMount, reactive, ref, toRefs, watch } from 'vue'
import { useHoldingStore } from '../store'


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
          name: {
            value: (holding : Holding) => {
              if (holding.symbol && holding.symbol.name) {
                return holding.symbol.name
              }

              if (holding.importRawData && holding.importRawData.description) {
                return holding.importRawData.description
              }
              return ''
            },
          },
          symbolName        : {},
          currentTotalPrice : {
            private : true,
            value   : (row : Holding) => (!row.lastPrice ? '' : row.lastPrice.price * row.openQty),
            format  : 'currency',
          },
          currentAvgPrice: {
            value: (row : Holding) => {
              return !row.lastPrice ? '' : row.lastPrice.price
            },
            format: 'money',
          },
          //
          openQty: {
            format: value => (value !== 0 ? value : ''),
          },
          lastBuyAt: {
            format: 'date',
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
          openPL: {
            format : 'percent',
            value  : (row : Holding) => {
              if (!row.lastPrice || row.openAvgPrice === 0) {
                return 0
              }

              return (row.lastPrice.price / row.openAvgPrice) - 1
            },
          },
          dayPLChange: {
            format : 'percent',
            value  : (row : Holding) => {
              if (!row.lastPrice || row.lastPrice.price === 0) {
                return null
              }

              return (row.lastPrice.previousClose / row.lastPrice.price) - 1
            },
          },
          overallPL: {
            format : 'percent',
            value  : (row : Holding) => {
              if (!row.lastPrice || row.openAvgPrice === 0) {
                return 0
              }

              return (row.lastPrice.price / row.openAvgPrice) - 1
            },
          },
          weight: {
            format : 'percent',
            value  : (row : Holding) => {
              return totalOpen.value === 0 ? 0 : ((row.openQty * row.openAvgPrice) / totalOpen.value)
            },
          },
        },
        tableLayout: {
          [Screens.DEFAULT]: [
            [
              'symbolName', 'openQty',
            ],
            [
              'openPL', 'openTotalPrice',
            ],
          ],
          [Screens.SM]: [
            [
              'symbolName', 'name',
            ],
            [
              'openQty', 'lastBuyAt',
            ],
            [
              'openTotalPrice', 'openAvgPrice',
            ],
            [
              'currentTotalPrice', 'currentAvgPrice',
            ],
            [
              'openPL', /* 'openTotalPrice',   'overallPL',*/
            ],
            [
              'dayPLChange', /*'dayPL',*/
            ],
            'weight',
          ],
        },
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

    onBeforeMount(async () => {
      await holdingStore.subscribe()
    })

    watch(holdingStore.holdings, () => {

      const rows : Holding[] = holdingStore.holdings

      totalOpen.value = holdingStore.holdings.reduce((result, holding) => {

        return result + (holding.openQty * holding.openAvgPrice)  // @todo this doesnt calculate actual current %, but open%

      }, 0)


      data.rows.open   = rows.filter(row => row.openQty !== 0)
      data.rows.closed = rows.filter(row => row.openQty === 0)
    }, {
      immediate: true,
    })


    return {
      ...toRefs(data),
      dayjs,
    }
  },
})
</script>
