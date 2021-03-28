<template>
  <div
    class="relative mx-4 lg:mx-0 sm:w-96 active::min-w-full"
  >
    <span class="absolute inset-y-0 left-0 pl-3 flex items-center">
      <svg
        class="h-5 w-5 text-gray-300"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
        />
      </svg>
    </span>

    <!--suppress HtmlFormInputWithoutLabel -->
    <input
      v-model="tickerName"
      class="w-32 min-w-full max-w-full rounded-lg pl-10 pr-4 border-0 focus:border-blue-300 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50"
      placeholder="Search"
      type="text"
      @keyup.enter="selectElement"
    >

    <ul
      v-if="symbols.data.length"
      class="absolute bg-white shadow-2xl rounded-lg mt-2 min-w-full overflow-hidden z-10"
    >
      <li
        v-for="symbol in symbols.data"
        :key="symbol"
      >
        <a
          href="#"
          class="hover:bg-gray-100 block px-4 py-2"
          @click.prevent="click(symbol)"
        >
          <div class="w-14 min-w-min">{{ symbol.get('symbol') }}</div>
          <div class="text-gray-500 text-sm">{{ symbol.get('name') }}</div>
        </a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">

import {defineComponent, reactive, ref, watch} from 'vue'
import {AssetSymbol} from '../../../common/models'
import {useRouter} from 'vue-router'

const getSymbols = async (tickerName: string): Promise<AssetSymbol[]> => {
  if (tickerName.length < 2) {
    return []
  }

  const q = new Parse.Query(AssetSymbol)
  q.startsWith('symbol', tickerName.toUpperCase())
  q.limit(10)
  //q.include(['exchange.name'])

  return await q.find()
}

export default defineComponent({
  setup () {
    const {push} = useRouter()

    const tickerName                     = ref('')
    const symbols: {data: AssetSymbol[]} = reactive({data: []})

    watch(tickerName, async tickerName => {
      symbols.data = await getSymbols(tickerName)
    })


    const click = (symbol: AssetSymbol) => {

      tickerName.value = '' // this triggers the watch

      push({
        name   : 'ticker_details',
        params : {
          ticker: symbol.get('symbol')
        }
      })
    }

    function selectElement () {
      click(symbols.data[0])
    }

    return {
      click,
      symbols,
      tickerName,
      selectElement
    }
  }


})
</script>
