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
      #filters(accounts)="{filter}"
    >
      <span>
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
      </span>
    </template>
    <template
      #field(name)="{ value , row }"
    >
      <AppLink
        v-if="row.symbol"
        :ticker="row.symbolName"
        class="font-bold"
        to="ticker_details"
      >
        <p class="font-normal text-sm">
          {{ value }}
        </p>
      </AppLink>
      <span v-else>
        {{ value }}
      </span>
    </template>

    <template
      #field(symbolName)="{value, row }"
    >
      <AppLink
        v-if="row.symbol"
        :ticker="row.symbolName"
        class="font-bold"
        to="ticker_details"
      >
        <p class="mr-3 font-bold">
          {{ value }}
        </p>
      </AppLink>
      <span v-else>
        {{ value }}
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

    <template
      #actions="{row}"
    >
      <buy-sell-asset
        v-if="row.type === 'BUY' || row.type === 'SELL'"
        :transaction="row"
      >
        <!--      @todo case sensitive row.type-->
        <template #button>
          <GoIcons
            name="Pencil"
            class="h-6 w-6 cursor-pointer hover:text-blue-600 text-gray-300"
          />
        </template>
      </buy-sell-asset>
      <div
        v-else
        class="h-6 w-6"
      />
      <GoIcons
        name="Trash"
        class="h-6 w-6 cursor-pointer hover:text-red-600 text-gray-300"
        @click="remove(row)"
      />
    </template>
  </DataTable>
</template>

<script lang="ts">
import { Transaction } from '/@common/models'
import { formatCurrency, padDecimals } from '/@common/utils'
import { useAccountStore, useTransactionStore } from '/@store/index'
import { Screens } from '/@utils/screens'
import * as dayjs from 'dayjs'
import { defineComponent, onBeforeMount, reactive, toRefs, watch } from 'vue'
import BuySellAsset from '../components/BuySellAsset.vue'
import DataTable from '../components/DataTable.vue'
import HeadlineActions from '../components/HeadlineActions.vue'
import AppLink from '../components/router/AppLink.vue'
import ImportTransactionsModal from '../components/Transactions/ImportTransactionsModal.vue'


export default defineComponent({
  components: {
    BuySellAsset, HeadlineActions, DataTable, AppLink, ImportTransactionsModal,
  },
  setup () {
    const data             = reactive({
      rows   : [],
      config : {
        fields: {
          type: {
            width: '10%',
          },
          executedAt: {
            justify : 'right',
            format  : 'date',
            width   : '20%',
          },
          name: {
            value: (transaction : Transaction) => {
              if (transaction.symbol && transaction.symbol.name) {
                return transaction.symbol.name
              }

              if (transaction.importRawData && transaction.importRawData.description) {
                return transaction.importRawData.description
              }
              return ''
            },
          },
          symbolName : {},
          quantity   : {
            justify : 'right',
            format  : value => {
              return value === 0 ? '' : padDecimals(value, 0, 2)
            },
          },
          price: {
            justify : 'right',
            format  : (value, row) => {
              return value === 0 ? '' : formatCurrency(value, row.currency, false)
            },
          },
          totalExcludingFees: {
            justify : 'right',
            format  : (value, row) => {
              return value === 0 ? '' : formatCurrency(value, row.currency)
            },
          },
          fees: {
            justify : 'right',
            format  : (value, row) => {
              return value === 0 ? '' : formatCurrency(value, row.currency)
            },
          },
        },
        tableLayout: {
          [Screens.DEFAULT]: [
            'type',
            [
              'executedAt',
              'name',
            ],
            [
              'quantity',
              'price',
            ],
          ],
          [Screens.SM]: [
            'type',
            'executedAt',
            [
              'name', 'symbolName',
            ],
            'quantity',
            'price',
          ],
          [Screens.XL]: [
            'type',
            'executedAt',
            [
              'name', 'symbolName',
            ],
            'quantity',
            'price',
            [
              'totalExcludingFees',
            ],
            'fees',
          ],
        },
        settings: {
          actions           : true,
          translationPrefix : 'transactions.table',
          sort              : {
            field     : 'executedAt',
            direction : 'desc'
          },
        },
        filters: {
          accounts: {
            align   : 'left',
            value   : null,
            options : [],
            handler : (value, row) => {
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
          handler: (searchString, transaction) => {
            const searchVal = searchString.toLowerCase()

            if (transaction.symbolName && transaction.symbolName.toLowerCase().startsWith(searchVal)) {
              return true
            }

            if (transaction.symbol
                && (
                  transaction.symbol.name.toLowerCase().includes(searchVal)
                )
            ) {
              return true
            }

            return dayjs(transaction.executedAt).format('YYYY-MM-DD').toLowerCase().startsWith(searchVal)
          },
        },
      },
    })
    const accountStore     = useAccountStore()
    const transactionStore = useTransactionStore()

    onBeforeMount(async () => {
      await transactionStore.subscribe()
      await accountStore.subscribe()
    })

    watch(() => accountStore.accounts, () => {
      data.config.filters.accounts.options = accountStore.accounts.map(account => {
        return {
          value : account,
          label : account.name,
        }
      })
    }, {
      immediate: true,
    })

    watch(() => transactionStore.transactions, () => {

      data.rows = transactionStore.transactions
    }, {
      immediate: true,
    })


    const remove = async (transaction : Transaction) => {
      if (confirm('Are you sure?')) {
        await transaction.destroy()
      }

    }

    return {
      ...toRefs(data),
      dayjs,
      remove,
    }
  },
})
</script>
