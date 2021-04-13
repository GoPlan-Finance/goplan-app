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
          :ticker="row.symbol"
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
          :ticker="value"
          class="font-bold"
          to="ticker_details"
        >
          <p class="font-normal text-sm">
            {{ value.name }}
          </p>
        </AppLink>
        <span v-else-if="row.importRawData && row.importRawData.description">
          {{ row.symbolName }}
        </span>
        <span v-else>
        <!--N/A-->
        </span>
      </template>

      <template
        #field(currentPrice)="{ row}"
      >
        <AssetPrice
          :symbol="row.symbol"
        />
      </template>
    </DataTable>
  </template>
</template>

<script lang="ts">

import { AssetPrice, Transaction } from '/common/models'
import { Query } from '/common/Query'
import { ArrayUtils, formatCurrency } from '/common/utils'
import AssetPrice2 from '../components/AssetPrice.vue'
import * as dayjs from 'dayjs'
import { defineComponent, onBeforeMount, onUnmounted, reactive, toRefs } from 'vue'
import BuySellAsset from '../components/BuySellAsset.vue'
import DataTable from '../components/DataTable.vue'
import HeadlineActions from '../components/HeadlineActions.vue'
import AppLink from '../components/router/AppLink.vue'


export default defineComponent({
  components: {
    AssetPrice: AssetPrice2,
    BuySellAsset,
    HeadlineActions,
    DataTable,
    AppLink,
  },
  setup () {
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
          openQty        : {},
          currentPrice   : {},
          closeQty       : {},
          openTotalPrice : {
            private : true,
            format  : (value, row) => {
              return row.currency ? formatCurrency(value, row.currency, true) : value.toFixed(2)
            },
          },
          openAvgPrice: {
            format: (value, row) => {
              return row.currency ? formatCurrency(value, row.currency, false) : value.toFixed(2)
            },
          },
        },
        headerLayout: [
          [
            'ticker', 'symbol',
          ],
          [
            'openQty', 'openAvgPrice',
          ],
          [
            'openTotalPrice',
          ],
          'closeQty',
          [
            'currentPrice',
          ],

        ],
        settings: {
          actions           : false,
          translationPrefix : 'holdings.table',
        },


        search: {
          handler: (transaction, searchString) => {
            const searchVal = searchString.toLowerCase()

            if (transaction.symbol
                && (transaction.symbol.name.toLowerCase().includes(searchVal)
                    || transaction.symbol.symbol.toLowerCase().startsWith(searchVal))
            ) {
              return true
            }

            return dayjs(transaction.executedAt).format('YYYY-MM-DD').toLowerCase().startsWith(searchVal)
          },
        },
      },
    })


    // const transactionUpdated = (transaction : Transaction) => {
    // }

    const transactions   = []
    let liveSubscription = null

    onBeforeMount(async () => {
      const q          = new Query(Transaction)
      q.limit(100000)
      q.descending('executedAt')
      q.include('symbol')
      liveSubscription = await q.liveQuery(transactions /*transactionUpdated*/)

      const holdings = ArrayUtils.groupBy<Transaction>(
        transactions.filter(transaction => {

          if (!transaction.type) {
            return false
          }

          return [
            'buy', 'sell',
          ].includes(transaction.type.toLowerCase())

        }), transaction => {
          if (transaction.symbol) {
            return transaction.symbol.symbol
          }

          if (transaction.importRawData && transaction.importRawData.symbol) {
            return transaction.importRawData.symbol
          }

          return 'N/A'
        })

      const rows = Object.entries(holdings).map(([
        symbolName, transactions,
      ]) => {

        //const symbol = await CacheableQuery.create(AssetSymbol).getObjectById()
        const symbol = transactions.length > 0 ? transactions[0].symbol : null
        const row    = {
          symbol,
          symbolName,
          currency       : symbol ? symbol.currency : null,
          openQty        : 0,
          closeQty       : 0,
          openTotalPrice : 0,
          openAvgPrice   : 0,
        }

        transactions.forEach(transaction => {
          if (transaction.type.toLowerCase() === 'buy') {
            row.openQty        += transaction.quantity
            row.openTotalPrice += transaction.totalExcludingFees
          }

          if (transaction.type.toLowerCase() === 'sell') {
            row.closeQty += transaction.quantity

            row.openQty        -= transaction.quantity
            row.openTotalPrice -= transaction.totalExcludingFees
          }
        })

        row.openAvgPrice = row.openQty !== 0 ? row.openTotalPrice / row.openQty : 0

        return row
      })


      data.rows.open   = rows.filter(row => row.openQty !== 0)
      data.rows.closed = rows.filter(row => row.openQty === 0)


    })

    onUnmounted(async () => {
      if (liveSubscription) {
        await liveSubscription.unsubscribe()
      }
    })

    return {
      ...toRefs(data),
      dayjs,
    }
  },
})
</script>
