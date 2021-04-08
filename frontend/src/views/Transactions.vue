<template>
  <HeadlineActions
    :headline="$t('transactions.headline')"
  >
    <ImportTransactionsModal/>
    <buy-sell-asset/>
  </HeadlineActions>

  <DataTable
    :config="config"
    :rows="rows"
  >
    <template
      #symbol="{ row }"
    >
      <AppLink
        v-if="row.symbol"
        :ticker="row.symbol"
        class="font-bold"
        to="ticker_details"
      >
        <p class="font-normal text-sm">
          {{ row.name }}
        </p>
      </AppLink>
      <span v-else-if="row.importRawData && row.importRawData.description">
        {{ row.importRawData.description }}
      </span>
      <span v-else>
          <!--N/A-->
      </span>
    </template>
    <template
      #ticker="{ row }"
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
        <p class="font-normal text-sm">
          {{ row.symbol.name }}
        </p>
      </AppLink>
      <span v-else-if="row.importRawData && row.importRawData.symbol">
        {{ row.importRawData.symbol }}
      </span>
      <span v-else>
          <!--N/A-->
      </span>
    </template>
    <template
      #type="{ value }"
    >
      <div
        :class="value ==='BUY'? 'text-blue-500' : 'text-yellow-500'"
        class="flex gap-2"
      >
        <ArrowCircleLeftIcon
          :class="value ==='BUY'? 'transform rotate-180' : ''"
          class="h-6 w-6"
        />
        {{ $t(config.settings.translationPrefix + '.' + value.toLowerCase()) }}
      </div>
    </template>
  </DataTable>
</template>

<script lang="ts">
import { Transaction } from '/common/models'
import { formatCurrency } from '/common/utils'
import { ArrowCircleLeftIcon } from '@heroicons/vue/solid'
import * as dayjs from 'dayjs'
import { defineComponent, onBeforeMount, onUnmounted, reactive, toRefs } from 'vue'
import BuySellAsset from '../components/BuySellAsset.vue'
import DataTable from '../components/DataTable.vue'
import HeadlineActions from '../components/HeadlineActions.vue'
import AppLink from '../components/router/AppLink.vue'
import ImportTransactionsModal from '../components/Transactions/ImportTransactionsModal.vue'


export default defineComponent({
  components : {
    BuySellAsset, HeadlineActions, DataTable, AppLink, ArrowCircleLeftIcon, ImportTransactionsModal,
  },
  setup () {
    const data = reactive({
      rows   : [],
      config : {
        headers      : {
          type               : {},
          value              : {},
          executedAt         : {
            justify : 'right',
            format  : 'date',
          },
          symbol             : {
            sortKey : 'name',
          },
          ticker             : {
            sortKey : 'name',
          },
          quantity           : {
            justify : 'right',
            format  : value => {
              return value % 1 > Number.EPSILON ? value : Number(value).toFixed(0)
            },
          },
          price              : {
            justify : 'right',
            format  : (value, row) => {
              return formatCurrency(value, row.currency, false)
            },
          },
          totalExcludingFees : {
            justify : 'right',
            format  : (value, row) => {
              return formatCurrency(value, row.currency)
            },
          },
          fees               : {
            justify : 'right',
            format  : (value, row) => {
              return formatCurrency(value, row.currency)
            },
          },
        },
        headerLayout : [
          'type',
          'executedAt',
          [
            'symbol', 'ticker',
          ],
          'quantity',
          'price',
          ['totalExcludingFees' ],
          'fees',
        ],
        settings     : {
          actions           : false,
          translationPrefix : 'transactions.table',
        },
        filters      : {
          type : {
            value   : '',
            options : [
              {
                value   : '',
                display : 'All Types',
              },
              {
                value   : 'BUY',
                display : 'Buy',
              },
              {
                value   : 'SELL',
                display : 'Sell',
              },
              {
                value   : 'DIVIDENDS',
                display : 'Dividends',
              },
              {
                value   : 'FEES',
                display : 'Fees',
              },
              {
                value   : 'TRANSFER',
                display : 'Transfers',
              },
            ],
          },
        },
        search       : {
          function : (transaction, searchString) => {
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


    let liveSubscription = null

    onBeforeMount(async () => {
      const q = new Parse.Query(Transaction)
      q.limit(100000)
      q.descending('executedAt')
      q.include('symbol')
      liveSubscription = await Transaction.liveQuery(q, data.rows)
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
