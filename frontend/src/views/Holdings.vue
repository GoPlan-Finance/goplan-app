<template>
  <HeadlineActions
    :headline="$t('holdings.headline')"
  >
    <buy-sell-asset />
  </HeadlineActions>

  <DataTable
    :config="config"
    :rows="rows"
  >
    <template
      #filters(accounts)="{filter}"
    >
      <label
        v-for="(option) in filter.options"
        :key="option.label"
        :class="filter.value && filter.value.id === option.value.id? 'bg-gray-300' : ''"
        class="inline-flex items-center px-2 mr-1 bg-gray-100 rounded-xl cursor-pointer hover:bg-gray-300 select-none"
      >
        <input
          v-model="filter.value"
          :text="option.label"
          :value="option.value"
          class="hidden"
          name="radio"
          type="radio"
          @click="filter.value = (filter.value && filter.value.id === option.value.id ? null : filter.value)"
        >
        <span class="py-1 px-2 text-sm text-gray-700">{{ option.label }}</span>
      </label>
    </template>
    <template
      #field(symbol)="{ row }"
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
      #field(type)="{ value }"
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
import { Account, Transaction } from '/common/models'
import { Query } from '/common/Query'
import { formatCurrency } from '/common/utils'
import { ArrowCircleLeftIcon } from '@heroicons/vue/solid'
import * as dayjs from 'dayjs'
import { defineComponent, onBeforeMount, onUnmounted, reactive, toRefs } from 'vue'
import BuySellAsset from '../components/BuySellAsset.vue'
import DataTable from '../components/DataTable.vue'
import HeadlineActions from '../components/HeadlineActions.vue'
import AppLink from '../components/router/AppLink.vue'


export default defineComponent({
  components: {
    BuySellAsset, HeadlineActions, DataTable, AppLink, ArrowCircleLeftIcon,
  },
  setup () {
    const data = reactive({
      rows   : [],
      config : {
        fields: {
          type       : {},
          value      : {},
          executedAt : {
            justify : 'right',
            format  : 'date',
          },
          symbol: {
            sortKey: 'name',
          },
          ticker: {
            sortKey: 'name',
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
          totalExcludingFees: {
            justify : 'right',
            format  : (value, row) => {
              return formatCurrency(value, row.currency)
            },
          },
          fees: {
            justify : 'right',
            format  : (value, row) => {
              return formatCurrency(value, row.currency)
            },
          },
        },
        headerLayout: [
          'type',
          'executedAt',
          [
            'symbol', 'ticker',
          ],
          'quantity',
          'price',
          [
            'totalExcludingFees',
          ],
          'fees',
        ],
        settings: {
          actions           : false,
          translationPrefix : 'holdings.table',
        },
        filters: {
          accounts: {
            align   : 'left',
            value   : null,
            options : [],
            handler : ({row, value} : { row : Transaction, value : Account }) : boolean => {
              console.log(row.account.id, value.id, row.account.id === value.id)
              return row.account.id === value.id
            },
          },
          type: {
            value   : '',
            options : [
              {
                value   : '',
                display : 'All Types',
              },
              {
                value : 'BUY',
                label : 'Buy',
              },
              {
                value : 'SELL',
                label : 'Sell',
              },
              {
                value : 'DIVIDENDS',
                label : 'Dividends',
              },
              {
                value : 'FEES',
                label : 'Fees',
              },
              {
                value : 'TRANSFER',
                label : 'Transfers',
              },
            ],
          },
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


    let liveSubscription = null

    onBeforeMount(async () => {
      const q          = new Query(Transaction)
      q.limit(100000)
      q.descending('executedAt')
      q.include('symbol')
      liveSubscription = await q.liveQuery(data.rows)

      const qA                             = new Query(Account)
      data.config.filters.accounts.options = (await qA.find()).map(account => {
        return {
          value : account,
          label : account.name,
        }
      })
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
