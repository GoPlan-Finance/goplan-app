<template>
  <div class="relative">
    <SearchField
      v-model:value="input"
      :input-class="searchFieldClass"
      :placeholder="placeholder ?? t('Search')"
      @keyup.enter="selectElement(symbols[activeElement])"
      @keyup.up="activeElement > 0 ? (activeElement -= 1) : null"
      @keyup.down="activeElement < symbols.length - 1 ? (activeElement += 1) : null"
      @update:value="onInput"
      @blur="onBlur"
      :disabled="disabled"
    />
    <ul
      v-if="isOpen"
      class="absolute bg-white max-h-56 shadow-2xl rounded-lg mt-2 overflow-y-scroll z-40"
    >
      <li
        v-if="symbols.length === 0 && loading"
        class="text-gray-500 block px-4 py-2 animate-pulse"
      >
        {{ t('Loading...') }}
      </li>
      <li v-else-if="symbols.length === 0" class="text-gray-500 block px-4 py-2">
        {{ t('No Assets found') }}
      </li>
      <li v-else v-for="(symbol, index) in symbols" :key="index">
        <div
          class="hover:bg-gray-100 block px-4 py-2 cursor-pointer select-none"
          :class="[
            activeElement === index ? 'bg-gray-100' : '',
            loading ? 'text-gray-300 animate-pulse' : '',
          ]"
          @click="selectElement(symbol)"
        >
          <div class="w-14 min-w-min">{{ symbol.tickerName }}</div>
          <div class="text-sm" :class="loading ? 'text-gray-300' : 'text-gray-500'">
            {{ symbol.name }}
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { AssetSymbol } from '@common/models';
import SearchField from '@components/base/SearchField.vue';
import { nextTick, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = withDefaults(
  defineProps<{
    searchFieldClass?: string;
    allowText?: boolean;
    placeholder?: string;
    disabled?: true;
  }>(),
  {
    allowText: false,
  }
);

const emit = defineEmits<{
  (e: 'update:asset-symbol', assetSymbol: AssetSymbol): void;
}>();

const isOpen = ref(false);
const loading = ref(false);
const activeElement = ref(0);
const input = ref('');
const symbols = ref<AssetSymbol[]>([]);

const resetDropDown = () => {
  input.value = '';
  symbols.value = [];
  activeElement.value = 0;
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

const onBlur = () => {
  // The timeout prevents the dropdown from closing before the click is registered
  setTimeout(() => {
    isOpen.value = false;
    input.value = '';
  }, 100);
};

const selectElement = (symbol: AssetSymbol) => {
  resetDropDown();
  emit('update:asset-symbol', symbol);
};
</script>
