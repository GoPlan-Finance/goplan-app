<template>
  <div>
    <div class="flex flex-wrap justify-between">
      <h1 class="text-gray-700 text-3xl font-medium mb-6">
        {{ $t('transactions.headline') }}
      </h1>
    </div>


    <DataTable
      :config="config"
      :rows="rows"
    >
      <template
        #position="{ row }"
      >
        <AppLink
          :ticker="row.symbol"
          to="ticker_details"
        >
          {{ row.name }}
        </AppLink>
      </template>
      <template
        #type="{ row }"
      >
        <div
          :class="row ==='BUY'? 'text-blue-500' : 'text-yellow-500'"
          class="flex gap-2"
        >
          <svg
            :class="row ==='BUY'? 'transform rotate-180' : ''"
            class="h-6 w-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clip-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z"
              fill-rule="evenodd"
            />
          </svg>

          {{ $t(config.settings.translationPrefix + '.' + row.toLowerCase()) }}
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, onUnmounted, reactive, toRefs, watch} from 'vue'
import {Transaction} from '../models'
import dayjs from 'dayjs'
import DataTable, {TableConfig} from '../components/DataTable.vue'
import AppLink from '../components/router/AppLink.vue'

enum Column {
  POSITION = 'position',
  DATE = 'executedAt',
  QUANTITY = 'quantity',
  PRICE = 'price',
  TYPE = 'type',
  VALUE = 'value',
}

export default defineComponent({
  components: {DataTable, AppLink},
  setup () {
    const data: TableConfig = reactive({
      transactions : [],
      rows         : [],
      config       : {
        headers: {
          type     : {},
          position : {
            classes: 'font-bold'
          },
          executedAt: {
            justify: 'right'
          },
          quantity: {
            justify: 'right'
          },
          price: {
            justify: 'right'
          },
          value: {
            justify: 'right'
          }
        },
        settings: {
          actions           : false,
          translationPrefix : 'transactions.table'
        }
      }
    })

    let liveSubscription = null

    const updateTable = () => {
      const rows = data.transactions.map(transaction => {
        return {
          [Column.POSITION] : transaction.symbol,
          [Column.DATE]     : dayjs(transaction.executedAt).format('YYYY-MM-DD'),
          [Column.QUANTITY] : transaction.quantity,
          [Column.PRICE]    : transaction.price,
          [Column.TYPE]     : transaction.type,
          [Column.VALUE]    : transaction.value,
        }
      })

      console.log('SET ROWS', rows)
      data.rows = rows
    }

    onBeforeMount(async () => {
      const q          = new Parse.Query(Transaction)
      q.descending('executedAt')
      q.include('symbol')
      liveSubscription = await Transaction.liveQuery(q, data.transactions)

      updateTable()
    })

    onUnmounted(async () => {
      if (liveSubscription) {
        await liveSubscription.unsubscribe()
      }
    })

    watch(() => data.transactions, () => updateTable())

    return {
      dayjs,
      ...toRefs(data),
      Column
    }
  },
})
</script>
