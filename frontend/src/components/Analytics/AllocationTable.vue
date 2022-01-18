<template>
  <DataTable :config="config" :rows="holdingStore.typeAllocations">
    <template #field(openChangeTotal)="{ value }">
      <PriceChange
        v-if="value"
        :compare-from="value.from"
        :compare-to="value.to"
        :currency="value.currency"
        total
      />
      <GSkeleton v-else class="h-6" />
    </template>
    <template #field(openChangePercent)="{ value }">
      <PriceChange
        v-if="value"
        :compare-from="value.from"
        :compare-to="value.to"
        :currency="value.currency"
      />
      <GSkeleton v-else class="h-6" />
    </template>
    <template #field(initialValue)="{ row }">
      {{ formatCurrency(row.initialValue, 'USD', true, 'en-us', 'never') }}
    </template>
    <template #field(currentValue)="{ row }">
      {{ formatCurrency(row.currentValue, 'USD', true, 'en-us', 'never') }}
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { RangeValue, TableConfig, TableLayoutCollection } from '@components/DataTable';
import DataTable from '@components/DataTable.vue';
import { CurrencyUtils } from '@goplan-finance/utils';
import { reactive } from 'vue';
import { Screens } from '@/utils/screens';
import { useHoldingStore } from '@/store';
import { TypeAllocation } from '@store/HoldingStore';
import PriceChange from '@components/PriceChange.vue';
import GSkeleton from '@components/base/GSkeleton.vue';

const formatCurrency = CurrencyUtils.formatCurrency;

const tableLayout: TableLayoutCollection = {
  [Screens.DEFAULT]: [['type'], ['currentValue']],
  [Screens.SM]: [
    ['type'],
    ['initialValue'],
    ['currentValue'],
    ['openChangeTotal', 'openChangePercent'],
    ['weight'],
  ],
};

const holdingStore = useHoldingStore();
await holdingStore.subscribe();

const typeAllocationRange = (typeAllocation: TypeAllocation): RangeValue => {
  if (!typeAllocation.initialValue || typeAllocation.currentValue === 0) {
    return null;
  }

  return {
    from: typeAllocation.initialValue,
    to: typeAllocation.currentValue,
    currency: 'USD',
  };
};

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
    openChangeTotal: {
      format: 'range',
      justify: 'right',
      value: (row: TypeAllocation): RangeValue => typeAllocationRange(row),
    },
    openChangePercent: {
      format: 'range',
      justify: 'right',
      value: (row: TypeAllocation): RangeValue => typeAllocationRange(row),
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
