<template>
  <div>
    <h1 class="text-gray-700 text-3xl font-medium mb-6">
      {{ $t('transactions.headline') }}
    </h1>

    <DataTable :config="data">
      <template
        #position="slotProps"
      >
        <AppLink
          :ticker="slotProps.row['ticker']"
          to="ticker_details"
        >
          {{ slotProps.row['position'] }}
        </AppLink>
      </template>
      <template
        #type="slotProps"
      >
        <div
          class="flex gap-2"
          :class="slotProps.row['type'] ==='BUY'? 'text-blue-500' : 'text-yellow-500'"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            :class="slotProps.row['type'] ==='BUY'? 'transform rotate-180' : ''"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z"
              clip-rule="evenodd"
            />
          </svg>
          {{ $t(data.settings.translationPrefix + '.' + slotProps.row['type'].toLowerCase()) }}
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, onUnmounted, reactive} from 'vue'
import {Transaction} from '../models'
import dayjs from 'dayjs'
import DataTable, {TableCellType, TableConfig} from '../components/DataTable.vue'
import AppLink from '../components/router/AppLink.vue'

export default defineComponent({
  components: {AppLink, DataTable},
  setup () {
    const transactions: Transaction[] = reactive([])
    let liveSubscription              = null

    onMounted(async () => {
      const q          = new Parse.Query(Transaction)
      q.descending('createdAt')
      q.include('symbol')
      liveSubscription = await Transaction.liveQuery(q, transactions)
    })

    const data: TableConfig = computed(() => {
      const rows = transactions.map(transaction => {
        return {
          'position' : transaction.symbol.get('name'),
          'ticker'   : transaction.symbol.get('symbol'),
          'date'     : dayjs(transaction.date).format('YYYY-MM-DD'),
          'quantity' : transaction.quantity.toFixed(2),
          'price'    : `${transaction.price.toDecimal().toFixed(2)} ${transaction.currency}`,
          'type'     : transaction.type,
          'value'    : `${transaction.value.toDecimal().toFixed(2).toLocaleString()} ${transaction.currency}`
        }
      })

      return {
        headers:
            [
              [
                {
                  key  : 'type',
                  type : TableCellType.CUSTOM
                }
              ],
              [
                {
                  key     : 'position',
                  type    : TableCellType.CUSTOM,
                  classes : 'font-bold'
                }
              ],
              [
                {
                  key     : 'date',
                  justify : 'right'
                }
              ],
              [
                {
                  key     : 'quantity',
                  justify : 'right'
                }
              ],
              [
                {
                  key     : 'price',
                  justify : 'right'
                }
              ],
              [
                {
                  key     : 'value',
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
      data
    }
  },
})
</script>
