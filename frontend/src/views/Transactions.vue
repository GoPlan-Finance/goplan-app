<template>
  <div>
    <h1 class="text-gray-700 text-3xl font-medium mb-6">
      Transactions
    </h1>
    <DataTable :config="data">
      <template
        #Position="slotProps"
      >
        <AppLink
          :ticker="slotProps.row['Ticker']"
          to="ticker_details"
        >
          {{ slotProps.row['Position'] }}
        </AppLink>
      </template>
      <template
        #Type="slotProps"
      >
        <div class="flex gap-2">
          <svg
            class="h-6 w-6"
            :class="slotProps.row['Type'] === 'BUY' ? 'transform rotate-180 text-yellow-500' : 'text-blue-500'"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
            />
          </svg>
          {{ slotProps.row['Type'] }}
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
          'Position' : transaction.get('symbol').get('name'),
          'Ticker'   : transaction.get('symbol').get('symbol'),
          'Date'     : dayjs(transaction.get('createdAt')).format('YYYY-MM-DD'),
          'Quantity' : transaction.get('quantity'),
          'Price'    : transaction.get('price'),
          'Type'     : transaction.get('type')
        }
      })

      return {
        headers:
            [
              [
                {
                  label : 'Type',
                  type  : TableCellType.CUSTOM
                }
              ],
              [
                {
                  label   : 'Position',
                  type    : TableCellType.LINK,
                  classes : 'font-bold'
                }
              ],
              [
                {
                  label   : 'Date',
                  justify : 'right'
                }
              ],
              [
                {
                  label   : 'Quantity',
                  justify : 'right'
                }
              ],
              [
                {
                  label   : 'Price',
                  justify : 'right'
                }
              ],
            ],
        rows,
        settings: {
          actions: false
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
