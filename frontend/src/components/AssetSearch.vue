<template>
  <div
    class="relative lg:mx-0 sm:w-96 active::min-w-full"
  >
    <SearchField
      v-model="input"
      @keyup.enter="selectElement()"
    />
    <ul
      v-if="symbols.data.length && isOpen"
      class="absolute bg-white shadow-2xl rounded-lg mt-2 min-w-full overflow-hidden z-10"
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
import { computed, defineComponent, onBeforeMount, reactive, ref } from 'vue'
import SearchField from '/@components/base/SearchField.vue'


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
    modelValue: {
      type     : AssetSymbol,
      required : false,
    },
  },
  emits: [
    'update:modelValue',
  ],
  setup (props, {emit}) {
    const isOpen                             = ref(false)
    const symbols : { data : AssetSymbol[] } = reactive({data: []})

    const tickerName : string = computed(() => (props.modelValue ? props.modelValue.symbol : ''))

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

    const input : string = computed({
      get () {
        return tickerName.value
      },
      set (param) {
        tickerName.value = param
        update()
      },

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
