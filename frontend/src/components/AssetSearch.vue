<template>
  <div
    class="relative"
  >
    <SearchField
      v-model="input"
      :placeholder="placeholder"
      :input-class="searchFieldClass"
      @keyup.enter="selectElement()"
    />
    <ul
      v-if="symbols.data.length && isOpen"
      class="absolute bg-white shadow-2xl rounded-lg mt-2 min-w-full overflow-hidden z-40"
    >
      <li
        v-for="symbol in symbols.data"
        :key="symbol"
      >
        <a
          class="hover:bg-gray-100 block px-4 py-2"
          href="#"
          @click.prevent="selectElement(symbol)"
        >
          <div class="w-14 min-w-min">{{ symbol.get('symbol') }}</div>
          <div class="text-gray-500 text-sm">{{ symbol.get('name') }}</div>
        </a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">

import { AssetSymbol } from '/@common/models'
import { Query } from '/@common/Query'
import SearchField from '/@components/base/SearchField.vue'
import { computed, defineComponent, reactive, ref, watch } from 'vue'


const getSymbols = async (tickerName : string) : Promise<AssetSymbol[]> => {
  if (tickerName.length < 2) {
    return []
  }

  const q = new Query(AssetSymbol)
  q.startsWith('symbol', tickerName.toUpperCase())
  q.limit(10)
  //q.include(['exchange.name'])

  return await q.find()
}

export default defineComponent({
  components : {SearchField},
  props      : {
    placeholder: {
      type    : String,
      default : 'Search',
    },
    modelValue: {
      required  : true,
      validator : prop => prop instanceof AssetSymbol || prop === null,
    },
    searchFieldClass: {
      type    : String,
      default : '',
    },
  },
  emits: [
    'update:modelValue',
  ],
  setup (props, {emit}) {
    const isOpen                             = ref(false)
    const symbols : { data : AssetSymbol[] } = reactive({data: []})

    const tickerName = ref<string>('')

    const update = async () => {
      if (!tickerName.value) {
        return
      }
      if (props.modelValue && tickerName.value === props.modelValue.symbol) {
        symbols.data = []
        return
      }
      isOpen.value = true
      symbols.data = await getSymbols(tickerName.value)
    }

    const input = computed<string>({
      get () {
        return tickerName.value
      },
      set (param : string) {
        if (tickerName.value === param) {
          return
        }

        tickerName.value = param
        update()
      },
    })

    watch(() => props.modelValue, () => {
      if (props.modelValue === null) {
        symbols.data     = []
        tickerName.value = ''
        isOpen.value     = false
      } else if (tickerName.value !== props.modelValue.symbol) {
        symbols.data     = []
        tickerName.value = props.modelValue.symbol
      }
    })

    function selectElement (symbol? : AssetSymbol | undefined) {
      if (!symbol) {
        symbol = symbols.data[0]
      }
      symbols.data     = []
      tickerName.value = symbol ? symbol.symbol : ''
      isOpen.value     = false
      emit('update:modelValue', symbol)
    }

    return {
      input,
      symbols,
      tickerName,
      isOpen,
      selectElement,
    }
  },


})
</script>
