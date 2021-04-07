<template>
  <HeadlineActions
    :headline="$t('transactions.headline')"
  >
    <SearchField
      v-model="search"
    />
    <label>
      <select
        id="type"
        v-model="typeFilter.value"
        class="rounded-lg border-0"
        name="type"
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

    <ImportTransactionsModal />
    <buy-sell-asset />
  </HeadlineActions>

  <DataTable
    :config="config"
    :rows="sortedRows"
  >
    <template
      #symbol="{ value }"
    >
      <AppLink
        :ticker="value.symbol"
        to="ticker_details"
      >
        <p class="mr-3 font-bold">
          {{ value.symbol }}
        </p>
        <p class="font-normal text-sm">
          {{ value.name }}
        </p>
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
import {computed, defineComponent, onBeforeMount, onUnmounted, reactive, ref, toRefs} from 'vue'
import {Transaction} from '../models'
import * as dayjs from 'dayjs'
import DataTable from '../components/DataTable.vue'
import ImportTransactionsModal from '../components/ImportTransactionsModal.vue'
import AppLink from '../components/router/AppLink.vue'
import {ArrowCircleLeftIcon} from '@heroicons/vue/solid'
import HeadlineActions from '../components/HeadlineActions.vue'
import SearchField from '../components/base/SearchField.vue'
import {formatCurrency} from '../../../common/utils'
import BuySellAsset from '../components/BuySellAsset.vue'


export default defineComponent({
  components: {
    BuySellAsset,    SearchField, HeadlineActions, DataTable, AppLink, ArrowCircleLeftIcon, ImportTransactionsModal
  },
  setup () {
    const data = reactive({
      transactions : [],
      rows         : [],
      config       : {
        headers: {
          type       : {},
          executedAt : {
            justify : 'right',
            format  : 'date'
          },
          symbol: {
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
        settings: {
          actions           : false,
          translationPrefix : 'transactions.table'
        }
      }
    })

    const typeFilter = reactive({
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

    const search = ref('')

    let liveSubscription = null

    const sortedRows = computed(() => {
      return data.transactions.filter(transaction => {
        if (typeFilter.value !== '') {
          if (transaction.type !== typeFilter.value) {
            return false
          }
        }
        if (search.value !== '') {
          const searchVal = search.value.toLowerCase()

          return transaction.symbol.name.toLowerCase().includes(searchVal)
              || transaction.symbol.symbol.toLowerCase().startsWith(searchVal)
              || dayjs(transaction.executedAt).format('YYYY-MM-DD').toLowerCase().startsWith(searchVal)


          // return Object.entries(row).some(([
          //   key, value
          // ]) => {
          // const sortKey = data.config.headers[key].sortKey
          // if (sortKey) {
          //   value = value[sortKey]
          // }
          // return String(value).toLowerCase().includes(search.value.toLowerCase())
          // })
        }
        return true
      })
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
      sortedRows,
      typeFilter,
      search
    }
  },
})
</script>
