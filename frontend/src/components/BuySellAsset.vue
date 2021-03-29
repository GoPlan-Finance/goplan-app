<template>
  <div
    class="relative lg:mx-0 sm:w-96 active::min-w-full"
  >
    <!--suppress HtmlFormInputWithoutLabel -->
    <input
      v-model="date"
      class=" "
      placeholder="QTY"
      type="date"
    >
    <!--suppress HtmlFormInputWithoutLabel -->
    <input
      v-model="quantity"
      class=""
      placeholder="QTY"
      type="number"
    >
    <!--suppress HtmlFormInputWithoutLabel -->
    <input
      v-model="price"
      class=""
      placeholder="$$$"
      type="number"
    >
    <button
      :disabled="!price || !date || !quantity"
      class="inline-flex items-center px-2 mr-1 bg-green-400 rounded-xl cursor-pointer hover:bg-gray-300 select-none"
      @click="addTransaction('buy')"
    >
      BUY
    </button>
    <button
      :disabled="!price || !date || !quantity"
      class="inline-flex items-center px-2 mr-1 bg-red-400 rounded-xl cursor-pointer hover:bg-gray-300 select-none"
      @click="addTransaction('sell')"
    >
      SELL
    </button>
  </div>
</template>

<script lang="ts">

import {defineComponent, ref} from 'vue'
import {AssetSymbol} from '../../../common/models'
import {Transaction} from '../models'
import dayjs from 'dayjs'


export default defineComponent({
  props: {
    assetSymbol: {
      type     : AssetSymbol,
      required : true,
    },
  },
  setup (props) {
    const quantity = ref(null)
    const price    = ref(null)
    const date     = ref(dayjs().format('YYYY-MM-DD'))


    const addTransaction = async (type: 'buy' | 'sell') => {

      const t = new Transaction()

      t.set('quantity', quantity.value)
      t.set('price', price.value)
      t.set('date', dayjs(date.value).toDate())
      t.set('type', type.toUpperCase())
      t.set('symbol', props.assetSymbol)

      await t.save()
      alert('saved :)')

      quantity.value = null
      price.value    = null
      date.value     = dayjs().format('YYYY-MM-DD')
    }


    return {
      addTransaction,
      date,
      quantity,
      price
    }
  }


})
</script>
