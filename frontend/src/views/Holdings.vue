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
        <span v-else-if="row.importRawData && row.importRawData.description">
          {{ row.symbolName }}
        </span>
        <span v-else>
        <!--N/A-->
        </span>
      </template>

      <template
        #field(dayPL)="{ row}"
      >
        <AssetPriceChange
          v-if="row.symbol"
          :compare-to="row.symbol"
          compare-from="previousClose"
        />
      </template>
      <template
        #field(openPL)="{ row}"
      >
        <template v-if="openOrClose === 'open' && row.openQty !== 0">
          <AssetPriceChange
            :compare-from="row.openAvgPrice"
            :compare-to="row.symbol"
          />
        </template>
      </template>
      <template
        #field(closePL)="{ row}"
      >
        <template v-if="row.closeQty !== 0">
          <AssetPriceChange
            :compare-from="row.openAvgPrice"
            :compare-to="row.closeAvgPrice"
          />
        </template>
      </template>
    </DataTable>
  </template>
</template>

<script lang="ts">

import { Transaction } from '/@common/models'
import { Query } from '/@common/Query'
import { ArrayUtils } from '/@common/utils'
import * as dayjs from 'dayjs'
import { defineComponent, onBeforeMount, onUnmounted, reactive, toRefs } from 'vue'
import AssetPriceChange from '/@components/AssetPriceChange.vue'
import BuySellAsset from '/@components/BuySellAsset.vue'
import DataTable from '/@components/DataTable.vue'
import HeadlineActions from '/@components/HeadlineActions.vue'
import AppLink from '/@components/router/AppLink.vue'


export default defineComponent({
  components: {
    AssetPriceChange,
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

          currentPrice : {},
          //
          openQty      : {
            format: value => (value !== 0 ? value : ''),
          },
          openTotalPrice: {
            private : true,
            format  : 'currency',
          },
          openAvgPrice: {
            format: 'money',
          },
          //
          closeQty: {
            format: value => (value !== 0 ? value : ''),
          },
          closeAvgPrice: {
            format: 'money',
          },
          closeTotalPrice: {
            private : true,
            format  : 'currency',
          },
          //
          dayPL   : {},
          openPL  : {},
          closePL : {},
        },
        headerLayout: [
          [
            'ticker', 'symbol',
          ],
          [
            'openQty', 'openAvgPrice'
          ],
          [
            'closeQty', 'closeAvgPrice'
          ],
          'dayPL',
          [
            'openPL', 'openTotalPrice'
          ],
          [
            'closePL', 'closeTotalPrice'
          ],
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


    const transactionUpdated = (transaction : Transaction, event) => {
      // if (!event) {
      //
      // }
      console.log(event, transaction)
    }

    const transactions   = []
    let liveSubscription = null

    onBeforeMount(async () => {
      const q          = new Query(Transaction)
      q.limit(100000)
      q.descending('executedAt')
      q.include('symbol')
      liveSubscription = await q.liveQuery(transactions, transactionUpdated)

      const holdings = ArrayUtils.groupBy<Transaction>(
        transactions.filter(transaction => {

          if (!transaction.type) {
            return false
          }

          return [
            'buy', 'sell',
          ].includes(transaction.type.toLowerCase())

        }), transaction => {
          const symbol = transaction.getTickerName()

          return symbol ? symbol : 'N/A'
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
          openTotalPrice : 0,
          openAvgPrice   : null,

          closeQty        : 0,
          closeTotalPrice : 0,
          closeAvgPrice   : null,

          dayPL   : null,
          openPL  : null,
          closePL : null,
        }

        transactions.forEach(transaction => {
          if (transaction.type.toLowerCase() === 'buy') {
            row.openQty        += transaction.quantity
            row.openTotalPrice += transaction.totalExcludingFees
          }

          if (transaction.type.toLowerCase() === 'sell') {
            row.closeQty        += transaction.quantity
            row.closeTotalPrice += transaction.totalExcludingFees

            // row.openQty -= transaction.quantity
            // row.openTotalPrice -= transaction.totalExcludingFees
          }
        })

        if (row.openQty) {
          row.openAvgPrice = row.openTotalPrice / (row.openQty)
        } else {
          row.openTotalPrice = null
          row.openAvgPrice   = null
        }

        if (row.closeQty) {
          row.openQty        -= row.closeQty
          row.openTotalPrice -= row.closeTotalPrice

          row.closeAvgPrice = row.closeTotalPrice / row.closeQty
        } else {
          row.closeTotalPrice = null
          row.closeAvgPrice   = null
        }

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
