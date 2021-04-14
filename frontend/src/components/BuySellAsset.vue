<template>
  <Modal
    title="Buy/Sell Asset"
  >
    <template #button>
      <ButtonDefault
        label="Buy/Sell"
      >
        <template #before>
          <PlusCircleIcon
            class="h-6 w-6"
          />
        </template>
      </ButtonDefault>
    </template>
    <template #content>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-5">
        <label class="col-span-1 md:col-span-2">
          <div class="text-gray-400 ml-2 mb-1">
            Asset
          </div>
          <asset-search
            v-model="symbol"
            class="w-full"
            search-field-class="border"
          />
        </label>
        <label class="col-start-1">
          <div class="text-gray-400 ml-2 mb-1">
            Account
          </div>
          <AccountSelect
            v-model="account"
            class="w-full"
          />
        </label>
        <label>
          <div class="text-gray-400 ml-2 mb-1">
            Date
          </div>
          <input
            v-model="executedAt"
            class="rounded w-full"
            placeholder="QTY"
            type="date"
          >
        </label>
        <label class="col-start-1">
          <div class="text-gray-400 ml-2 mb-1">
            Quantity
          </div>
          <input
            v-model="quantity"
            class="rounded w-full"
            type="number"
          >
        </label>
        <label>
          <div class="text-gray-400 ml-2 mb-1">
            Price
          </div>
          <input
            v-model="price"
            class="rounded w-full"
            type="number"
          >
        </label>
      </div>
    </template>
    <template #actions>
      <ButtonDefault
        :disabled="!symbol || !price || !executedAt || !quantity"
        class="inline-flex items-center px-2 mr-1 bg-green-400 rounded-xl cursor-pointer hover:bg-gray-300 select-none"
        label="Buy"
        @click="addTransaction('buy')"
      />
      <ButtonDefault
        :disabled="!price || !executedAt || !quantity"
        class="bg-red-500"
        label="Sell"
        @click="addTransaction('sell')"
      />
    </template>
  </Modal>
</template>

<script lang="ts">

import { Account, AssetSymbol, Transaction } from '/@common/models'
import AccountSelect from '/@components/AccountSelect.vue'
import * as dayjs from 'dayjs'
import { defineComponent, ref } from 'vue'
import AssetSearch from '/@components/AssetSearch.vue'
import ButtonDefault from './base/ButtonDefault.vue'
import Modal from '/@components/base/GoModal.vue'
import { PlusCircleIcon } from '@heroicons/vue/solid'


export default defineComponent({
  components : {AccountSelect, AssetSearch, Modal, ButtonDefault, PlusCircleIcon},
  props      : {
    assetSymbol: {
      type    : AssetSymbol,
      default : null,
    },
  },
  setup (props) {
    const symbol : AssetSymbol = ref(props.assetSymbol)
    const quantity             = ref(null)
    const price                = ref(null)
    const account: Account     = ref(null)
    const executedAt           = ref(dayjs().format('YYYY-MM-DD'))

    const addTransaction = async (type : 'buy' | 'sell') => {

      const t = new Transaction()

      t.set('quantity', quantity.value)
      t.set('price', price.value)
      t.set('executedAt', dayjs(executedAt.value).toDate())
      t.set('type', type.toUpperCase())
      t.set('symbol', symbol.value)
      t.set('currency', symbol.value.currency)
      t.set('account', account.value)

      await t.save()
      alert('saved :)')

      quantity.value   = null
      price.value      = null
      executedAt.value = dayjs().format('YYYY-MM-DD')
    }

    return {
      addTransaction,
      symbol,
      executedAt,
      quantity,
      price,
      account
    }
  },


})
</script>
