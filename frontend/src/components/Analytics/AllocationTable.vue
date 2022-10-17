<template>
  <DataTable :config="config" :rows="holdingStore.typeAllocations">
    <template #field(openChangeTotal)="{ value }">
      <PriceChange v-if="value" :compare-from="value.from" :compare-to="value.to" total />
      <GSkeleton v-else class="h-6" />
    </template>
    <template #field(openChangePercent)="{ value }">
      <PriceChange
        v-if="value"
        :compare-from="value.from"
        :compare-to="value.to"
        class="font-bold"
      />
      <GSkeleton v-else class="h-6" />
    </template>
    <template #field(initialValue)="{ row }">
      {{ formatCurrency(row.initialValue) }}
    </template>
    <template #field(currentValue)="{ row }">
      {{ formatCurrency(row.currentValue) }}
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { RangeValue, TableConfig } from '@components/DataTable/useDataTable';
import DataTable from '@components/DataTable/DataTable.vue';
import { reactive } from 'vue';
import { Screens } from '@/hooks/useScreensize';
import { useHoldingStore } from '@/store';
import { TypeAllocation } from '@store/HoldingStore';
import PriceChange from '@components/PriceChange.vue';
import GSkeleton from '@components/base/GSkeleton.vue';
import { TableLayoutCollection } from '@components/DataTable/useTableLayout';
import { useNumberFormat } from '@/hooks/useNumberFormat';

const tableLayoutCollection: TableLayoutCollection = {
  [Screens.DEFAULT]: [['type'], ['currentValue']],
  [Screens.SM]: [
    ['type'],
    ['initialValue'],
    ['currentValue'],
    ['openChangeTotal', 'openChangePercent'],
    ['weight'],
  ],
};

const { formatCurrency } = useNumberFormat();
const holdingStore = useHoldingStore();
await holdingStore.subscribe();

const typeAllocationRange = (typeAllocation: TypeAllocation): RangeValue => {
  if (!typeAllocation.initialValue || typeAllocation.currentValue === 0) {
    return null;
  }

  return {
    from: typeAllocation.initialValue,
    to: typeAllocation.currentValue,
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
        return holdingStore.totalOpen === 0 ? 0 : row.currentValue / holdingStore.totalOpen;
      },
    },
  },
  tableLayoutCollection,
  settings: {
    actions: false,
    translationPrefix: 'allocations.type.table',
  },
});
</script>
