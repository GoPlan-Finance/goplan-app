<template>
  <div class="relative">
    <SearchField
      v-model="input"
      :input-class="searchFieldClass"
      :placeholder="placeholder"
      @keyup.enter="selectElement(symbols[0])"
    />
    <ul
      v-if="symbols.length && isOpen"
      class="absolute bg-white shadow-2xl rounded-lg mt-2 min-w-full overflow-hidden z-40"
    >
      <li v-for="symbol in symbols" :key="symbol">
        <a
          class="hover:bg-gray-100 block px-4 py-2"
          href="#"
          @click.prevent="selectElement(symbol)"
        >
          <div class="w-14 min-w-min">{{ symbol.tickerName }}</div>
          <div class="text-gray-500 text-sm">{{ symbol.name }}</div>
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { AssetSymbol } from '@common/models';
import SearchField from '@components/base/SearchField.vue';
import { computed, ref, watch } from 'vue';

const getSymbols = async (tickerName: string): Promise<AssetSymbol[]> => {
  if (tickerName.length === 0) {
    return [];
  }

  return Parse.Cloud.run('Assets--Search', {
    query: tickerName,
  });
};

const props = withDefaults(
  defineProps<{
    searchFieldClass?: string;
    allowText?: boolean;
    placeholder?: string;
    assetSymbol?: AssetSymbol | string | undefined;
  }>(),
  {
    placeholder: 'Search',
    allowText: false,
  }
);

const emit = defineEmits<{
  (e: 'update:asset-symbol', assetSymbol: AssetSymbol): void;
  (e: 'update:ticker-name', ticker: string): void;
}>();

const isOpen = ref(false);
const symbols = ref<AssetSymbol[]>([]);
const tickerName = ref<string>('');

watch(
  () => props.assetSymbol,
  () => {
    if (props.assetSymbol instanceof AssetSymbol) {
      tickerName.value = props.assetSymbol.tickerName;
    } else if (typeof props.assetSymbol === 'string') {
      tickerName.value = props.assetSymbol;
    }
  }
);

const update = async () => {
  if (!tickerName.value) {
    return;
  }

  if (props.assetSymbol && tickerName.value === props.assetSymbol.tickerName) {
    symbols.value = [];
    return;
  }

  isOpen.value = true;
  symbols.value = await getSymbols(tickerName.value);
};

const input = computed<string>({
  get() {
    return tickerName.value;
  },
  set(param: string) {
    if (tickerName.value === param) {
      return;
    }

    if (param === '') {
      emit('update:ticker-name', '');
      return;
    }

    tickerName.value = param;

    update();
  },
});

const resetDropDown = () => {
  symbols.value = [];
  isOpen.value = false;
};

const selectElement = (symbol: AssetSymbol) => {
  console.log(symbol);

  tickerName.value = symbol.tickerName;
  resetDropDown();
  emit('update:asset-symbol', symbol);
};
</script>
