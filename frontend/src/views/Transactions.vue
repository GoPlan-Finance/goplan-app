<template>
  <div>
    <HeadlineActions>
      <h1 class="text-gray-700 text-3xl font-medium mb-6">
        {{ $t('transactions.headline') }}
      </h1>
    </HeadlineActions>

    <div class="flex justify-end mb-4">
      <label>
        <div class="text-gray-500 text-sm mb-2">
          Type
        </div>
        <select
          id="type"
          v-model="typeFilter.value"
          name="type"
          class="rounded border-0"
        >
          <option
            v-for="option in typeFilter.options"
            :key="option.value"
            :value="option.value"
          >
            {{ option.display }}
          </option>
        </select>
      </label>
    </div>

    <DataTable :config="data">
      <template
        #position="{ row }"
      >
        <AppLink
          :ticker="row['ticker']"
          to="ticker_details"
        >
          {{ row['position'] }}
        </AppLink>
      </template>
      <template
        #type="{ row }"
      >
        <div
          class="flex gap-2"
          :class="row['type'] ==='BUY'? 'text-blue-500' : 'text-yellow-500'"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            :class="row['type'] ==='BUY'? 'transform rotate-180' : ''"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z"
              clip-rule="evenodd"
            />
          </svg>
          {{ $t(data.settings.translationPrefix + '.' + row['type'].toLowerCase()) }}
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, onUnmounted, reactive} from 'vue'
import {Transaction} from '../models'
import dayjs from 'dayjs'
import DataTable, {TableCellType, TableConfig, TableRow} from '../components/DataTable.vue'
import AppLink from '../components/router/AppLink.vue'
import HeadlineActions from '../components/HeadlineActions.vue'

enum Column {
  POSITION = 'position',
  TICKER = 'ticker',
  DATE = 'date',
  QUANTITY = 'quantity',
  PRICE = 'price',
  TYPE = 'type',
  VALUE = 'value',
}

export default defineComponent({
  components: {HeadlineActions, AppLink, DataTable},
  setup () {
    const transactions: Transaction[] = reactive([])
    let liveSubscription              = null
    const typeFilter                  = reactive({
      value   : '',
      options : [
        {
          value   : '',
          display : 'All',
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
    })

    onMounted(async () => {
      const q          = new Parse.Query(Transaction)
      q.descending('date')
      q.include('symbol')
      liveSubscription = await Transaction.liveQuery(q, transactions)
    })

    const data: TableConfig = computed(() => {
      let rows = transactions.map(transaction => {
        const row: TableRow = {
          [Column.POSITION] : transaction.symbol.name,
          [Column.TICKER]   : transaction.symbol.symbol,
          [Column.DATE]     : dayjs(transaction.date).format('YYYY-MM-DD'),
          [Column.QUANTITY] : transaction.quantity.toFixed(2),
          [Column.PRICE]    : `${transaction.price.toDecimal().toFixed(2)} ${transaction.currency}`,
          [Column.TYPE]     : transaction.type,
          [Column.VALUE]    : `${transaction.value.toDecimal().toFixed(2).toLocaleString()} ${transaction.currency}`
        }
        return row
      })

      rows = rows.filter(row => {
        if (typeFilter.value !== '') {
          return row.type === typeFilter.value
        }
        return true
      })

      return {
        headers:
            [
              [
                {
                  key  : Column.TYPE,
                  type : TableCellType.CUSTOM
                }
              ],
              [
                {
                  key     : Column.POSITION,
                  type    : TableCellType.CUSTOM,
                  classes : 'font-bold'
                }
              ],
              [
                {
                  key     : Column.DATE,
                  type    : TableCellType.STRING,
                  justify : 'right'
                }
              ],
              [
                {
                  key     : Column.QUANTITY,
                  type    : TableCellType.NUMBER,
                  justify : 'right'
                }
              ],
              [
                {
                  key     : Column.PRICE,
                  type    : TableCellType.NUMBER,
                  justify : 'right'
                }
              ],
              [
                {
                  key     : Column.VALUE,
                  type    : TableCellType.NUMBER,
                  justify : 'right'
                }
              ],
            ],
        rows,
        settings: {
          actions           : false,
          translationPrefix : 'transactions.table'
        }
      }
    })

    onUnmounted(async () => {
      if (liveSubscription) {
        await liveSubscription.unsubscribe()
      }
    })


    return {
      dayjs,
      transactions,
      data,
      Column,
      typeFilter
    }
  },
})
</script>
