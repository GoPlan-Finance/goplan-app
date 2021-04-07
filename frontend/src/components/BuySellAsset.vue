<template>
  <Modal
    title="Buy/Sell Asset"
  >
    <template #button>
      <ButtonDefault
        label="Buy/Sell"
      >
        <template #before>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="w-6 h-6"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
              clip-rule="evenodd"
            />
          </svg>
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
        label="Buy"
        :disabled="!price || !executedAt || !quantity"
        class="inline-flex items-center px-2 mr-1 bg-green-400 rounded-xl cursor-pointer hover:bg-gray-300 select-none"
        @click="addTransaction('buy')"
      />
      <ButtonDefault
        label="Sell"
        :disabled="!price || !executedAt || !quantity"
        class="bg-red-500"
        @click="addTransaction('sell')"
      />
    </template>
  </Modal>
</template>

<script lang="ts">

import {defineComponent, ref, watch} from 'vue'
import {AssetSymbol} from '../../../common/models'
import {Transaction} from '../models'
import dayjs from 'dayjs'
import ButtonDefault from './base/ButtonDefault.vue'
import Modal from './Modal.vue'
import AssetSearch from '../components/AssetSearch.vue'


export default defineComponent({
  components : {AssetSearch,  Modal, ButtonDefault},
  props      : {
    assetSymbol: {
      type    : AssetSymbol,
      default : null
    },
  },
  setup (props) {
    const symbol     = ref(props.assetSymbol)
    const quantity   = ref(null)
    const price      = ref(null)
    const executedAt = ref(dayjs().format('YYYY-MM-DD'))


    const addTransaction = async (type: 'buy' | 'sell') => {

      const t = new Transaction()

      t.set('quantity', quantity.value)
      t.set('price', price.value)
      t.set('executedAt', dayjs(executedAt.value).toDate())
      t.set('type', type.toUpperCase())
      t.set('symbol', symbol.value)

      await t.save()
      alert('saved :)')

      quantity.value   = null
      price.value      = null
      executedAt.value = dayjs().format('YYYY-MM-DD')
    }

    // watch(symbol, async () => {
    //
    // })


    return {
      addTransaction,
      symbol,
      executedAt,
      quantity,
      price
    }
  }


})
</script>
