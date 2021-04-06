<template>
  <div>
    <HeadlineActions>
      <h1 class="text-gray-700 text-3xl font-medium">
        {{ $t('transactions.headline') }}
      </h1>
      <div>
        <label>
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
    </HeadlineActions>

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
          <ArrowCircleLeftIcon
            class="h-6 w-6"
            :class="row ==='BUY'? 'transform rotate-180' : ''"
          />

          {{ $t(config.settings.translationPrefix + '.' + row.toLowerCase()) }}
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onBeforeMount, onUnmounted, reactive, toRefs} from 'vue'
import {Transaction} from '../models'
import dayjs from 'dayjs'
import DataTable from '../components/DataTable.vue'
import AppLink from '../components/router/AppLink.vue'
import {ArrowCircleLeftIcon} from '@heroicons/vue/solid'
import HeadlineActions from '../components/HeadlineActions.vue'

enum Column {
  POSITION = 'position',
  DATE = 'executedAt',
  QUANTITY = 'quantity',
  PRICE = 'price',
  TYPE = 'type',
  VALUE = 'value',
}

export default defineComponent({
  components: {HeadlineActions, DataTable, AppLink, ArrowCircleLeftIcon},
  setup () {
    const data = reactive({
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

    const typeFilter                  = reactive({
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
    })

    let liveSubscription = null

    const rows = computed(() => {
      let mappedRows = data.transactions.map(transaction => {
        return {
          [Column.POSITION] : transaction.symbol,
          [Column.DATE]     : dayjs(transaction.executedAt).format('YYYY-MM-DD'),
          [Column.QUANTITY] : transaction.quantity,
          [Column.PRICE]    : transaction.price,
          [Column.TYPE]     : transaction.type,
          [Column.VALUE]    : transaction.value,
        }
      })

      mappedRows = mappedRows.filter(row => {
        if (typeFilter.value !== '') {
          return row.type === typeFilter.value
        }
        return true
      })

      console.log('SET ROWS', rows)
      return mappedRows
    })


    onBeforeMount(async () => {
      const q          = new Parse.Query(Transaction)
      q.descending('executedAt')
      q.include('symbol')
      liveSubscription = await Transaction.liveQuery(q, data.transactions)
    })

    onUnmounted(async () => {
      if (liveSubscription) {
        await liveSubscription.unsubscribe()
      }
    })

    return {
      dayjs,
      ...toRefs(data),
      Column,
      rows,
      typeFilter
    }
  },
})
</script>
