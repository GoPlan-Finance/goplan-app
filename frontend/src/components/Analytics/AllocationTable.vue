<template>
  <DataTable :config="config" :rows="holdingStore.typeAllocations">
    <template #field(initialValue)="{ row }">
      {{ formatCurrency(row.initialValue, 'USD', true, 'en-us', 'never') }}
    </template>
    <template #field(currentValue)="{ row }">
      {{ formatCurrency(row.currentValue, 'USD', true, 'en-us', 'never') }}
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { TableConfig, TableLayoutCollection } from '@components/DataTable';
import DataTable from '@components/DataTable.vue';
import { CurrencyUtils } from '@goplan-finance/utils';
import { reactive } from 'vue';
import { Screens } from '@/utils/screens';
import { useHoldingStore } from '@/store';
import { TypeAllocation } from '@store/HoldingStore';

const formatCurrency = CurrencyUtils.formatCurrency;

const tableLayout: TableLayoutCollection = {
  [Screens.DEFAULT]: [['type'], ['initialValue'], ['currentValue'], ['weight']],
};

const holdingStore = useHoldingStore();
await holdingStore.subscribe();

const config = reactive<TableConfig>({
  fields: {
    type: {},
    initialValue: {
      private: true,
      justify: 'right',
    },
    currentValue: {
      private: true,
      justify: 'right',
    },
    weight: {
      format: 'percent',
      justify: 'right',
      value: (row: TypeAllocation) => {
        if (!row.currentValue) {
          return 0;
        }
        // @todo currency
        return holdingStore.totalOpen === 0 ? 0 : row.currentValue / holdingStore.totalOpen;
      },
    },
  },
  tableLayout,
  settings: {
    actions: false,
    translationPrefix: 'allocations.type.table',
  },
});
</script>
