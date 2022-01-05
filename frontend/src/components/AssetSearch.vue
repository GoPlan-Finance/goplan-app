<template>
  <div class="relative">
    <SearchField
      :model-value="input"
      :input-class="searchFieldClass"
      :placeholder="placeholder"
      @keyup.enter="selectElement(symbols[0])"
      @update:model-value="onInput"
    />
    <ul
      v-if="isOpen"
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
      <li v-if="loading" class="text-gray-500 block px-4 py-2">
        {{ t('Loading...') }}
      </li>
      <li v-else-if="symbols.length === 0" class="text-gray-500 block px-4 py-2">
        {{ t('No Assets found') }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { AssetSymbol } from '@common/models';
import SearchField from '@components/base/SearchField.vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

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
}>();

const isOpen = ref(false);
const loading = ref(false);
const input = ref('');
const symbols = ref<AssetSymbol[]>([]);

const resetDropDown = () => {
  symbols.value = [];
  isOpen.value = false;
};

const getSymbols = async (tickerName: string): Promise<void> => {
  if (tickerName === '') {
    resetDropDown();
    return;
  }
  loading.value = true;
  symbols.value = await Parse.Cloud.run('Assets--Search', {
    query: tickerName,
  });
  loading.value = false;
};

const onInput = async (value: string) => {
  isOpen.value = true;
  await getSymbols(value);
};

const selectElement = (symbol: AssetSymbol) => {
  input.value = symbol.tickerName;
  resetDropDown();
  emit('update:asset-symbol', symbol);
};
</script>
