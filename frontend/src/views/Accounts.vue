<template>
  <HeadlineActions :headline="t('accounts.headline')">
    <EditCreateAccount />
  </HeadlineActions>
  <template v-if="rows.length > 0">
    <DataTable :config="config" :rows="rows">
      <template #actions="{ row }">
        <EditCreateAccount :account="row">
          <template #button>
            <PencilIcon class="h-6 w-6 cursor-pointer hover:text-blue-600 text-gray-300" />
          </template>
        </EditCreateAccount>
      </template>
    </DataTable>
  </template>
  <template v-else>
    <div class="text-center">No Accounts</div>
  </template>
</template>

<script setup lang="ts">
import { useAccountStore, useTransactionStore, useUserStore } from '@/store';
import { Screens } from '@/hooks/useScreensize';
import { computed, reactive } from 'vue';
import DataTable from '@components/DataTable/DataTable.vue';
import HeadlineActions from '../components/HeadlineActions.vue';
import { useI18n } from 'vue-i18n';
import EditCreateAccount from '@components/EditCreateAccount.vue';
import { PencilIcon } from '@heroicons/vue/solid';
import { Account } from '@models';
import { TableConfig } from '@components/DataTable/useDataTable';
import { TransactionType } from '@models/Transaction';

const { t } = useI18n();

const accountStore = useAccountStore();
await accountStore.subscribe();
const transactionStore = useTransactionStore();
await transactionStore.subscribe();
const userStore = useUserStore();
await userStore.loadUser();

await transactionStore.subscribe();
await accountStore.subscribe();

const rows = computed(() => accountStore.accounts);

const config = reactive<TableConfig>({
  fields: {
    name: {},
    balance: {
      justify: 'right',
      format: 'currency',
      value: (account: Account) => {
        // TODO: Handle currencies
        return transactionStore.transactions.reduce((result, currentTransaction) => {
          if (currentTransaction.account.id === account.id) {
            if (currentTransaction.type.toLowerCase() === TransactionType.SELL) {
              return (result ?? 0) + currentTransaction.totalExcludingFees;
            } else if (currentTransaction.type.toLowerCase() === TransactionType.BUY) {
              return (result ?? 0) - currentTransaction.totalExcludingFees;
            }
          } else {
            return result;
          }
        }, 0);
      },
    },
  },
  tableLayoutCollection: {
    [Screens.DEFAULT]: [['name'], ['balance']],
  },
  settings: {
    actions: true,
    translationPrefix: 'accounts.table',
    sort: {
      field: 'name',
      direction: 'desc',
    },
    locale: userStore.state.user?.locale,
  },
  filters: {},
});
</script>
