<template>
  <DataTable
    :config="config"
    :rows="rows"
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
      #field(closedPL)="{ row }"
    >
      <AssetPriceChange
        :compare-from="row.buyTotalPrice"
        :compare-to=" row.closedTotalPrice"
      />
    </template>

    <!--    <template-->
    <!--      #field(dayPLChange)="{ row}"-->
    <!--    >-->
    <!--      <AssetPriceChange-->
    <!--        v-if="row.lastPrice"-->
    <!--        :compare-from="(openOrClose === 'close' ?row.openQty : 1) * row.lastPrice.previousClose"-->
    <!--        :compare-to=" (openOrClose === 'close' ?row.openQty : 1)* row.lastPrice.price"-->
    <!--      />-->
    <!--      <span v-else>-->
    <!--          &#45;&#45;-->
    <!--        </span>-->
    <!--    </template>-->

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

<script lang="ts">

import { Holding } from '/@common/models/Holding'
import AssetPriceChange from '/@components/AssetPriceChange.vue'
import { TableLayout, TableRow } from '/@components/DataTable'
import DataTable from '/@components/DataTable.vue'
import AppLink from '/@components/router/AppLink.vue'
import * as dayjs from 'dayjs'
import { defineComponent, PropType, reactive, ref, toRefs } from 'vue'


export default defineComponent({
  components: {
    AssetPriceChange,
    DataTable,
    AppLink,
  },
  props: {
    rows: {
      type     : Object as PropType<TableRow[]>,
      required : true,
    },
    tableLayout: {
      type     : Object as PropType<TableLayout[]>,
      required : true,
    },
  },
  setup (props) {
    const totalOpen = ref(0)

    const data = reactive({
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
          symbolName : {},
          buyQty     : {},

          currentTotalPrice: {
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

          lastBuyAt: {
            format: 'date',
          },
          lastSellAt: {
            format: 'date',
          },
          //
          openQty: {
            format: value => (value !== 0 ? value : ''),
          },
          openTotalPrice: {
            private : true,
            format  : 'currency',
          },
          openAvgPrice: {
            format: 'money',
          },
          openPL: {
            format : 'percent',
            value  : (row : Holding) => {
              if (!row.lastPrice || row.openAvgPrice === 0) {
                return 0
              }

              return (row.lastPrice.price / row.openAvgPrice) - 1
            },
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
          closedPL: {
            format : 'percent',
            value  : (row : Holding) => {
              if (!row.lastPrice || row.openAvgPrice === 0) {
                return 0
              }

              return (row.lastPrice.price / row.openAvgPrice) - 1
            },
          },
          //

          dayPLChange: {
            format : 'percent',
            value  : (row : Holding) => {
              if (!row.lastPrice || row.lastPrice.price === 0) {
                return null
              }

              return (row.lastPrice.previousClose / row.lastPrice.price) - 1
            },
          },

          weight: {
            format : 'percent',
            value  : (row : Holding) => {
              return totalOpen.value === 0 ? 0 : ((row.openQty * row.openAvgPrice) / totalOpen.value)
            },
          },
        },
        tableLayout : props.tableLayout,
        settings    : {
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


    return {
      ...toRefs(data),
      dayjs,
    }
  },
})
</script>
