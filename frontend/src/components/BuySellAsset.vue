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
      <div class="grid grid-cols-2 gap-2">
        <label>
          <div class="text-gray-400 ml-2 mb-1">
            Asset
          </div>
          <asset-search v-model="symbol" />
        </label>
        <label class="col-start-1">

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
            class="rounded min-w-min"
            placeholder="QTY"
            type="number"
          >
        </label>
        <label>
          <div class="text-gray-400 ml-2 mb-1">
            Price
          </div>
          <input
            v-model="price"
            class="rounded"
            placeholder="$$$"
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

import { AssetSymbol, Transaction } from '/@common/models'
import * as dayjs from 'dayjs'
import { defineComponent, ref } from 'vue'
import AssetSearch from '/@components/AssetSearch.vue'
import ButtonDefault from './base/ButtonDefault.vue'
import Modal from '/@components/base/GoModal.vue'
import { PlusCircleIcon } from '@heroicons/vue/solid'


export default defineComponent({
  components : {AssetSearch, Modal, ButtonDefault, PlusCircleIcon},
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
    const executedAt           = ref(dayjs().format('YYYY-MM-DD'))

    console.log(symbol)
    const addTransaction = async (type : 'buy' | 'sell') => {

      const t = new Transaction()

      t.set('quantity', quantity.value)
      t.set('price', price.value)
      t.set('executedAt', dayjs(executedAt.value).toDate())
      t.set('type', type.toUpperCase())
      t.set('symbol', symbol.value)
      t.set('currency', symbol.value.currency)

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
    }
  },


})
</script>
