<template>
  <HeadlineActions
    :headline="$t('transactions.headline')"
  >
    <ImportTransactionsModal />
    <buy-sell-asset />
  </HeadlineActions>

  <DataTable
    :config="config"
    :rows="rows"
  >
    <template
      #symbol="{ value }"
    >
      <AppLink
        :ticker="value.symbol"
        to="ticker_details"
        class="font-bold"
      >
        {{ value.name }}
      </AppLink>
    </template>
    <template
      #ticker="{ row }"
    >
      <AppLink
        :ticker="row.symbol.symbol"
        to="ticker_details"
        class="lg:text-gray-500"
      >
        {{ row.symbol.symbol }}
      </AppLink>
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
import {defineComponent, onBeforeMount, onUnmounted, reactive, toRefs} from 'vue'
import {Transaction} from '../models'
import * as dayjs from 'dayjs'
import DataTable from '../components/DataTable.vue'
import ImportTransactionsModal from '../components/ImportTransactionsModal.vue'
import AppLink from '../components/router/AppLink.vue'
import {ArrowCircleLeftIcon} from '@heroicons/vue/solid'
import HeadlineActions from '../components/HeadlineActions.vue'
import {formatCurrency} from '../../../common/utils'
import BuySellAsset from '../components/BuySellAsset.vue'


export default defineComponent({
  components: {
    BuySellAsset, HeadlineActions, DataTable, AppLink, ArrowCircleLeftIcon, ImportTransactionsModal
  },
  setup () {
    const data = reactive({
      rows   : [],
      config : {
        headers: {
          type       : {},
          executedAt : {
            justify : 'right',
            format  : 'date'
          },
          symbol: {
            sortKey: 'name'
          },
          ticker: {
            sortKey: 'name'
          },
          quantity: {
            justify : 'right',
            format  : value => {
              return value % 1 > Number.EPSILON ? value : Number(value).toFixed(0)
            },
          },
          price: {
            justify : 'right',
            format  : (value, row) => {
              return formatCurrency(value, row.currency, false)
            },
          },
          value: {
            justify : 'right',
            format  : (value, row) => {
              return formatCurrency(value, row.currency)
            },
          }
        },
        headerLayout: [
          'type',
          [
            'symbol', 'ticker'
          ],
          'quantity',
          'price',
          'value'
        ],
        settings: {
          actions           : false,
          translationPrefix : 'transactions.table'
        },
        filters: {
          type: {
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
            ]
          }
        },
        search: {
          function: (transaction, searchString) => {
            return transaction.symbol.name.toLowerCase().includes(searchString)
                || transaction.symbol.symbol.toLowerCase().startsWith(searchString)
                || dayjs(transaction.executedAt).format('YYYY-MM-DD').toLowerCase().startsWith(searchString)
          }
        }
      }
    })

    let liveSubscription = null

    onBeforeMount(async () => {
      const q          = new Parse.Query(Transaction)
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
