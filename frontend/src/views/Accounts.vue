<template>
  <HeadlineActions :headline="t('accounts.headline')">
    <EditCreateAccount />
  </HeadlineActions>
  <template v-if="rows.length > 0">
    <DataTable :config="config" :rows="accountStore.accounts">
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
import { useAccountStore, useTransactionStore } from '@/store';
import { Screens } from '@/utils/screens';
import { computed, reactive } from 'vue';
import DataTable from '../components/DataTable.vue';
import HeadlineActions from '../components/HeadlineActions.vue';
import { useI18n } from 'vue-i18n';
import EditCreateAccount from '@components/EditCreateAccount.vue';
import { PencilIcon, TrashIcon } from '@heroicons/vue/solid';
import { Account } from '@models';

const { t } = useI18n();

const config = reactive({
  fields: {
    name: {},
    currency: {},
  },
  tableLayout: {
    [Screens.DEFAULT]: [['name'], ['currency']],
  },
  settings: {
    actions: true,
    translationPrefix: 'accounts.table',
    sort: {
      field: 'name',
      direction: 'desc',
    },
  },
  filters: {},
});

const accountStore = useAccountStore();
const transactionStore = useTransactionStore();

await transactionStore.subscribe();
await accountStore.subscribe();

const rows = computed(() => accountStore.accounts);
</script>
