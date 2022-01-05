<template>
  <Modal v-model="isModalOpen" :title="t('Buy/Sell Asset')" @opened="modalOpened">
    <template #button>
      <slot name="button">
        <ButtonDefault :label="transaction?.id ? t('Edit') : t('Buy/Sell')">
          <template v-if="!transaction?.id" #before>
            <PlusCircleIcon class="h-6 w-6" />
          </template>
        </ButtonDefault>
      </slot>
    </template>
    <template #content>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-5">
        <label class="col-span-1 md:col-span-2">
          <div class="text-gray-400 ml-2 mb-1">{{ t('Asset') }}</div>
          <div v-if="transactionInternal.symbol" class="bg-gray-100 px-4 py-2 rounded relative">
            <div>
              <div class="w-14 min-w-min">{{ transactionInternal.symbol.tickerName }}</div>
              <div class="text-gray-500 text-sm">{{ transactionInternal.symbol.name }}</div>
            </div>
            <XCircleIcon
              @click="transactionInternal.symbol = null"
              class="absolute right-4 top-5 h-5 text-gray-400 hover:text-gray-500 cursor-pointer"
            />
          </div>
          <AssetSearch
            v-else
            @update:asset-symbol="transactionInternal.symbol = $event"
            class="w-full"
            search-field-class="border w-full"
          />
        </label>
        <label class="col-start-1">
          <div class="text-gray-400 ml-2 mb-1">{{ t('Account') }}</div>
          <AccountSelect v-model="transactionInternal.account" class="w-full" />
        </label>
        <label>
          <div class="text-gray-400 ml-2 mb-1">{{ t('Date') }}</div>
          <input v-model="executedAt" class="rounded w-full" placeholder="QTY" type="date" />
        </label>
        <label class="col-start-1">
          <div class="text-gray-400 ml-2 mb-1">{{ t('Quantity') }}</div>
          <input
            v-model="transactionInternal.quantity"
            class="rounded w-full"
            min="0"
            type="number"
          />
        </label>
        <label>
          <div class="text-gray-400 ml-2 mb-1">{{ t('Price') }}</div>
          <input
            v-model="transactionInternal.price"
            class="rounded w-full"
            min="0"
            step="0.01"
            type="number"
          />
        </label>
      </div>
    </template>
    <template #actions>
      <template v-if="!transaction?.id">
        <ButtonDefault
          :disabled="!isValid"
          class="inline-flex items-center px-2 mr-1 bg-green-400 rounded-xl cursor-pointer hover:bg-gray-300 select-none"
          label="Buy"
          @click="buy"
        />
        <ButtonDefault :disabled="!isValid" class="bg-red-500" label="Sell" @click="sell" />
      </template>
      <template v-else>
        <ButtonDefault
          :disabled="!isValid"
          class="inline-flex items-center px-2 mr-1 bg-green-400 rounded-xl cursor-pointer hover:bg-gray-300 select-none"
          label="Save"
          @click="save"
        />
      </template>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { Account, AssetSymbol, Transaction } from '@common/models';
import { Query } from '@goplan-finance/utils';
import { XCircleIcon } from '@heroicons/vue/solid';
import AccountSelect from '@components/AccountSelect.vue';
import AssetSearch from '@components/AssetSearch.vue';
import Modal from '@components/base/GoModal.vue';
import dayjs from 'dayjs';
import { computed, ref } from 'vue';
import ButtonDefault from './base/ButtonDefault.vue';
import { PlusCircleIcon } from '@heroicons/vue/outline';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
  assetSymbol?: AssetSymbol;
  transaction?: Transaction;
}>();

const createTransaction = () => {
  const newTransaction = new Transaction();
  newTransaction.executedAt = new Date();
  newTransaction.quantity = 0;
  newTransaction.price = null;
  newTransaction.executedAt = new Date();
  newTransaction.currency = 'USD'; // TODO: Handle different currencies
  return newTransaction;
};

const transactionInternal = ref<Transaction>(props.transaction ?? createTransaction());
const isModalOpen = ref(false);

const executedAt = computed<string>({
  get() {
    return dayjs(transactionInternal.value.executedAt).format('YYYY-MM-DD');
  },
  set(value) {
    transactionInternal.value.executedAt = dayjs(value).toDate();
  },
});

const isValid = computed<boolean>(
  () => !!transactionInternal.value
  // !!transactionInternal.value.symbolName &&
  // !isNaN(transactionInternal.value.price) &&
  // !isNaN(transactionInternal.value.quantity) &&
  // dayjs(transactionInternal.value.executedAt).isValid() &&
  // !!transactionInternal.value.account
);

const reset = () => {
  transactionInternal.value = createTransaction();
  isModalOpen.value = false;
};

const save = async (type: 'buy' | 'sell' | undefined) => {
  if (transactionInternal.value.isNew()) {
    transactionInternal.value.type = type;
  }

  transactionInternal.value.totalExcludingFees =
    transactionInternal.value.price * transactionInternal.value.quantity;

  await transactionInternal.value.save();
  reset();
};

const buy = async () => {
  await save('buy');
};

const sell = async () => {
  await save('sell');
};

const modalOpened = async () => {
  if (props.transaction) {
    transactionInternal.value = await Query.create(Transaction).getObjectById(props.transaction.id);
  }

  if (props.assetSymbol) {
    transactionInternal.value.symbol = props.assetSymbol;
  }
};
</script>
