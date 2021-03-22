<template>
  <div class="relative mx-4 lg:mx-0">
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
      class="w-32 sm:w-64 rounded-lg pl-10 pr-4 border-0 focus:border-blue-300 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50"
      placeholder="Search"
      type="text"
    >

    <ul v-if="symbols.data.length">
      <li v-for="symbol in symbols.data">
        <a
          href="#"
          @click.prevent="click(symbol)"
        >
          {{ symbol.get('symbol') }} - <small>{{ symbol.get('name') }}</small>
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
  q.limit(20)
  //q.include(['exchange.name'])

  const symbols = await q.find()

  return symbols
}

export default defineComponent({
  setup () {
    const {push} = useRouter()

    const tickerName = ref('')
    const symbols    = reactive({data: []})

    watch(tickerName, async tickerName => {
      symbols.data = await getSymbols(tickerName)
    })


    const click = (symbol: AssetSymbol) => {

      tickerName.value = '' // this triggers the watch

      push({
        name   : 'Details',
        params : {
          ticker: symbol.get('symbol')
        }
      })
    }


    return {
      click,
      symbols,
      tickerName,
    }
  }


})
</script>
