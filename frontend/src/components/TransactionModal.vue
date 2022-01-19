<template>
  <Modal
    v-model="isModalOpen"
    :title="transaction ? t('Edit Transaction') : t('Add Transaction')"
    @opened="modalOpened"
    @closed="reset"
  >
    <template #button>
      <slot name="button">
        <ButtonDefault :label="transaction ? t('Edit') : t('Buy/Sell')">
          <template v-if="!transaction?.id" #before>
            <PlusCircleIcon class="h-6 w-6" />
          </template>
        </ButtonDefault>
      </slot>
    </template>
    <template #content>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-5">
        <GFormItem :label="t('Type')" :error="errors.type">
          <TransactionTypeSelect v-model:value="transactionInternal.type" class="w-full" />
        </GFormItem>
        <GFormItem
          :label="t('Asset')"
          :error="!transactionInternal.symbol ? errors.symbol : null"
          class="col-span-1 md:col-span-2"
        >
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
            :disabled="!showAssetInput"
            @update:asset-symbol="transactionInternal.symbol = $event"
            class="w-full"
            search-field-class="border w-full"
          />
        </GFormItem>
        <GFormItem :label="t('Account')" :error="errors.account">
          <AccountSelect v-model="transactionInternal.account" class="w-full" />
        </GFormItem>
        <GFormItem :label="t('Date')" :error="errors.executedAt">
          <input v-model="executedAt" class="rounded w-full" type="date" />
        </GFormItem>
        <GFormItem :label="t('Quantity')" :error="errors.quantity">
          <input
            v-model="transactionInternal.quantity"
            class="rounded w-full disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none"
            min="0"
            type="number"
            :disabled="!showQuantityInput"
          />
        </GFormItem>
        <GFormItem :label="t('Price')" :error="errors.price">
          <input
            v-model="transactionInternal.price"
            class="rounded w-full"
            min="0"
            step="0.01"
            type="number"
          />
        </GFormItem>
      </div>
    </template>
    <template #actions>
      <template v-if="transaction">
        <ButtonDefault :label="t('Save')" @click="save" />
      </template>
      <template v-else>
        <ButtonDefault :label="t('Create')" @click="save" />
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
import { computed, reactive, ref } from 'vue';
import ButtonDefault from './base/ButtonDefault.vue';
import { PlusCircleIcon } from '@heroicons/vue/outline';
import { useI18n } from 'vue-i18n';
import GFormItem from '@components/base/GFormItem.vue';
import TransactionTypeSelect from '@components/TransactionTypeSelect.vue';
import { TransactionType } from '@models/Transaction';

const { t } = useI18n();

const props = defineProps<{
  assetSymbol?: AssetSymbol;
  transaction?: Transaction;
}>();

const createTransaction = () => {
  const newTransaction = new Transaction();
  newTransaction.executedAt = new Date();
  newTransaction.quantity = null;
  newTransaction.price = null;
  newTransaction.type = TransactionType.BUY;
  newTransaction.executedAt = new Date();
  return newTransaction;
};

const errors = reactive({
  symbol: null,
  account: null,
  executedAt: null,
  quantity: null,
  price: null,
  type: null,
});

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

const reset = () => {
  transactionInternal.value = createTransaction();
  isModalOpen.value = false;
};

const showAssetInput = computed<boolean>(() => {
  return [
    TransactionType.SELL,
    TransactionType.BUY,
    TransactionType.FEES,
    TransactionType.DIVIDENDS,
  ].some(type => type === transactionInternal.value.type);
});

const showQuantityInput = computed<boolean>(() => {
  return [TransactionType.SELL, TransactionType.BUY].some(
    type => type === transactionInternal.value.type
  );
});

const isValid = computed<boolean>(() => {
  if (!transactionInternal.value.symbol && showAssetInput) {
    errors.symbol = t('Please select an asset');
  } else {
    errors.symbol = null;
  }
  if (!transactionInternal.value.account) {
    errors.account = t('Please select an account');
  } else {
    errors.account = null;
  }
  if (
    !dayjs(transactionInternal.value.executedAt).isValid() ||
    dayjs(transactionInternal.value.executedAt).isAfter(new Date())
  ) {
    errors.executedAt = t('Please select a valid date');
  } else {
    errors.executedAt = null;
  }
  if (
    showQuantityInput &&
    (!transactionInternal.value.quantity || isNaN(transactionInternal.value.quantity))
  ) {
    errors.quantity = t('Please select a quantity');
  } else if (showQuantityInput && transactionInternal.value.quantity <= 0) {
    errors.quantity = t('Please select a quantity above zero');
  } else {
    errors.quantity = null;
  }
  if (!transactionInternal.value.price || isNaN(transactionInternal.value.price)) {
    errors.price = t('Please select a price');
  } else if (transactionInternal.value.price <= 0) {
    errors.price = t('Please select a price above zero');
  } else {
    errors.price = null;
  }

  if (Object.values(errors).filter(error => error !== null).length > 0) {
    return false;
  }
  return true;
});

const save = async () => {
  if (!isValid.value) {
    return;
  }

  transactionInternal.value.totalExcludingFees =
    transactionInternal.value.price * transactionInternal.value.quantity;

  transactionInternal.value.currency =
    transactionInternal.value.symbol?.currency ?? transactionInternal.value.account.currency;

  try {
    await transactionInternal.value.save();
    reset();
  } catch (e) {
    alert(e);
  }
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
