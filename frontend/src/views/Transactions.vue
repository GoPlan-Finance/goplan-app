<template>
  <ExportTransactionsModal
    v-if="transactionStore.transactions.length > 0"
    v-model:show="showExportModal"
  />
  <ImportTransactionsModal v-model:show="showImportModal" />
  <HeadlineActions :headline="t('transactions.headline')">
    <BuySellAsset>
      <template #button>
        <ButtonDefault :label="t('Add Transaction')">
          <template #before>
            <PlusCircleIcon class="h-6 w-6" />
          </template>
        </ButtonDefault>
      </template>
    </BuySellAsset>
    <GDropdown>
      <template #button="{ toggle }">
        <ButtonDefault :type="ButtonType.SECONDARY" label="Export/Import" @click="toggle">
          <template #before>
            <CogIcon class="h-6 text-gray-500" />
          </template>
        </ButtonDefault>
      </template>
      <template #default="{ toggle }">
        <div
          @click="(showExportModal = true) && toggle()"
          class="cursor-pointer select-none px-4 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white"
        >
          {{ t('Export CSV') }}
        </div>
        <div
          @click="(showImportModal = true) && toggle()"
          class="cursor-pointer select-none px-4 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white"
        >
          {{ t('Import CSV') }}
        </div>
      </template>
    </GDropdown>
  </HeadlineActions>
  <template v-if="rows.length > 0">
    <DataTable :config="config" :rows="rows">
      <template #filters(accounts)="{ filter }">
        <AccountSelect v-model="filter.value" class="w-full border-0" />
      </template>
      <template #filters(type)="{ filter }">
        <TransactionTypeSelect v-model:value="filter.value" class="w-full border-0" />
      </template>
      <template #field(name)="{ value, row }">
        <AppLink v-if="row.symbol" :ticker="row.symbolName" class="font-bold" to="ticker_details">
          <p class="font-normal text-sm">
            {{ value }}
          </p>
        </AppLink>
        <span v-else>
          {{ value }}
        </span>
      </template>

      <template #field(symbolName)="{ value, row }">
        <AppLink v-if="row.symbol" :ticker="row.symbolName" class="font-bold" to="ticker_details">
          <p class="mr-3 font-bold">
            {{ value }}
          </p>
        </AppLink>
        <span v-else>
          {{ value }}
        </span>
      </template>
      <template #field(type)="{ value }">
        <div v-if="value.toLowerCase() === TransactionType.BUY" class="flex gap-2 text-blue-500">
          <ArrowCircleLeftIcon class="h-6 w-6 transform rotate-180" />
          {{ t('transactions.type.' + value.toLowerCase()) }}
        </div>
        <div
          v-else-if="value.toLowerCase() === TransactionType.SELL"
          class="flex gap-2 text-yellow-500"
        >
          <ArrowCircleLeftIcon class="h-6 w-6" />
          {{ t('transactions.type.' + value.toLowerCase()) }}
        </div>
        <div
          v-else-if="value.toLowerCase() === TransactionType.DEPOSIT"
          class="flex gap-2 text-green-600"
        >
          <PlusCircleIcon class="h-6 w-6" />
          {{ t('transactions.type.' + value.toLowerCase()) }}
        </div>
        <div
          v-else-if="value.toLowerCase() === TransactionType.WITHDRAW"
          class="flex gap-2 text-orange-500"
        >
          <MinusCircleIcon class="h-6 w-6" />
          {{ t('transactions.type.' + value.toLowerCase()) }}
        </div>
        <div
          v-else-if="value.toLowerCase() === TransactionType.FEES"
          class="flex gap-2 text-gray-500"
        >
          <InformationCircleIcon class="h-6 w-6" />
          {{ t('transactions.type.' + value.toLowerCase()) }}
        </div>
        <div
          v-else-if="value.toLowerCase() === TransactionType.DIVIDENDS"
          class="flex gap-2 text-lime-600"
        >
          <DotsCircleHorizontalIcon class="h-6 w-6" />
          {{ t('transactions.type.' + value.toLowerCase()) }}
        </div>
      </template>

      <template #actions="{ row }">
        <BuySellAsset :transaction="row">
          <template #button>
            <PencilIcon class="h-6 w-6 cursor-pointer hover:text-blue-600 text-gray-300" />
          </template>
        </BuySellAsset>
        <TrashIcon
          class="h-6 w-6 cursor-pointer hover:text-red-600 text-gray-300"
          @click="remove(row)"
        />
      </template>
    </DataTable>
  </template>
  <template v-else>
    <div class="text-center">No Transactions</div>
  </template>
</template>

<script setup lang="ts">
import { Transaction } from '@common/models';
import { useAccountStore, useNotificationStore, useTransactionStore } from '@/store';
import { Screens } from '@/hooks/useScreensize';
import dayjs from 'dayjs';
import { computed, onBeforeMount, reactive, ref, watch } from 'vue';
import BuySellAsset from '@components/TransactionModal.vue';
import DataTable from '@components/DataTable/DataTable.vue';
import HeadlineActions from '../components/HeadlineActions.vue';
import AppLink from '../components/router/AppLink.vue';
import ImportTransactionsModal from '../components/Transactions/ImportTransactionsModal.vue';
import { CurrencyUtils, StringUtils } from '@goplan-finance/utils';
import {
  ArrowCircleLeftIcon,
  PencilIcon,
  TrashIcon,
  CogIcon,
  PlusCircleIcon,
  MinusCircleIcon,
  InformationCircleIcon,
  DotsCircleHorizontalIcon,
} from '@heroicons/vue/solid';
import { useI18n } from 'vue-i18n';
import ExportTransactionsModal from '@components/Transactions/ExportTransactionsModal.vue';
import AccountSelect from '@components/AccountSelect.vue';
import GDropdown from '@components/base/GDropdown.vue';
import { ButtonType } from '@/types';
import ButtonDefault from '@components/base/ButtonDefault.vue';
import TransactionTypeSelect from '@components/TransactionTypeSelect.vue';
import { TransactionType } from '@models/Transaction';
import { NotificationItem } from '@store/NotificationStore';
import { TableConfig } from '@components/DataTable/useDataTable';
import { useNumberFormat } from '@/hooks/useNumberFormat';

const { t } = useI18n();
const { formatCurrency, formatNumber } = useNumberFormat();

const accountStore = useAccountStore();
await accountStore.subscribe();
const transactionStore = useTransactionStore();
await transactionStore.subscribe();

const rows = computed(() => transactionStore.transactions);
const showExportModal = ref(false);
const showImportModal = ref(false);
const config = reactive<TableConfig>({
  fields: {
    type: {},
    executedAt: {
      format: 'date',
    },
    name: {
      value: (transaction: Transaction) => {
        if (transaction.symbol && transaction.symbol.name) {
          return transaction.symbol.name;
        }

        if (transaction.importRawData && transaction.importRawData.hasOwnProperty('description')) {
          return transaction.importRawData['description'];
        }
        return '';
      },
    },
    symbolName: {},
    quantity: {
      justify: 'right',
      format: (value: number) => {
        return value === 0
          ? ''
          : formatNumber(value, { maximumFractionDigits: 2, minimumFractionDigits: 0 });
      },
    },
    price: {
      justify: 'right',
      format: (value: number, row: Transaction) => {
        return value === 0 ? '' : formatCurrency(value, row.currency);
      },
    },
    totalExcludingFees: {
      justify: 'right',
      format: (value: number, row: Transaction) => {
        return value === 0 ? '' : formatCurrency(value, row.currency);
      },
    },
    fees: {
      justify: 'right',
      format: (value: number, row: Transaction) => {
        return value === 0 ? '' : formatCurrency(value, row.currency);
      },
    },
  },
  tableLayoutCollection: {
    [Screens.DEFAULT]: [
      ['executedAt', 'type'],
      ['symbolName', 'name'],
      ['quantity', 'price'],
    ],
    [Screens.SM]: ['type', 'executedAt', ['symbolName', 'name'], 'quantity', 'price'],
    [Screens.XL]: [
      'type',
      'executedAt',
      ['symbolName', 'name'],
      'quantity',
      'price',
      ['totalExcludingFees'],
      'fees',
    ],
  },
  settings: {
    actions: true,
    translationPrefix: 'transactions.table',
    sort: {
      field: 'executedAt',
      direction: 'desc',
    },
  },
  filters: {
    accounts: {
      align: 'left',
      value: null,
      options: accountStore.accounts.map(account => {
        return {
          value: account,
          label: account.name,
        };
      }),
      handler: (value, row: Transaction) => {
        return row.account.id === value.id;
      },
    },
    type: {
      align: 'left',
      value: null,
      options: [],
      handler: (value, row: Transaction) => {
        return row.type === value;
      },
    },
  },
  search: {
    handler: (searchString: string, transaction: Transaction) => {
      const searchVal = searchString.toLowerCase();

      if (transaction.symbolName && transaction.symbolName.toLowerCase().startsWith(searchVal)) {
        return true;
      }

      if (transaction.symbol && transaction.symbol.name.toLowerCase().includes(searchVal)) {
        return true;
      }

      return dayjs(transaction.executedAt).format('YYYY-MM-DD').toLowerCase().startsWith(searchVal);
    },
  },
});

const remove = async (transaction: Transaction) => {
  if (confirm('Are you sure?')) {
    await transaction.destroy();
  }
};
</script>
