<template>
  <DataTable :config="config" :rows="holdings">
    <template #field(symbolName)="{ value, row }">
      <AppLink v-if="row.symbol" :ticker="row.symbolName" class="font-bold" to="ticker_details">
        {{ value }}
      </AppLink>
      <span v-else>
        {{ value }}
      </span>
    </template>
    <template #field(name)="{ value, row }">
      <AppLink
        v-if="row.symbol"
        :ticker="row.symbolName"
        class="text-gray-500 font-light"
        to="ticker_details"
      >
        {{ value }}
      </AppLink>
      <span v-else>
        {{ value }}
      </span>
    </template>
    <template #field(openPLPercent)="{ value }">
      <PriceChange
        v-if="value"
        :compare-from="value.from"
        :compare-to="value.to"
        :currency="value.currency"
        class="font-bold"
      />
      <GSkeleton v-else class="h-6" />
    </template>
    <template #field(openPL)="{ value }">
      <PriceChange
        v-if="value"
        :compare-from="value.from"
        :compare-to="value.to"
        :currency="value.currency"
        total
      />
      <GSkeleton v-else class="h-6" />
    </template>
    <template #field(closedPL)="{ value }">
      <PriceChange
        v-if="value"
        :compare-from="value.from"
        :compare-to="value.to"
        :currency="value.currency"
      />
      <GSkeleton v-else class="h-6" />
    </template>
    <template #summary(openTotalPrice)>
      {{ formatCurrency(totalBookValue, 'TBD') }}
    </template>
    <template #summary(currentTotalPrice)>
      {{ formatCurrency(totalOpen, 'TBD') }}
    </template>
    <template #summary(openPL)>
      <PriceChange :compare-from="totalBookValue" :compare-to="totalOpen" total />
    </template>
    <template #summary(openPLPercent)>
      <PriceChange :compare-from="totalBookValue" :compare-to="totalOpen" />
    </template>
  </DataTable>
</template>

<script lang="ts" setup>
import { Holding } from '@common/models/Holding';
import PriceChange from '@components/PriceChange.vue';
import { RangeValue, TableConfig } from '@components/DataTable/useDataTable';
import DataTable from '@components/DataTable/DataTable.vue';
import AppLink from '@components/router/AppLink.vue';
import { CurrencyUtils } from '@goplan-finance/utils';
import { reactive } from 'vue';
import GSkeleton from '@components/base/GSkeleton.vue';
import { useUserStore } from '@/store';
import { TableLayoutCollection } from '@components/DataTable/useTableLayout';
import { useNumberFormat } from '@/hooks/useNumberFormat';

const { formatCurrency } = useNumberFormat();
const userStore = useUserStore();
await userStore.loadUser();

const props = defineProps<{
  holdings: Holding[];
  totalOpen: number;
  totalBookValue: number;
  tableLayout: TableLayoutCollection;
}>();

const config = reactive<TableConfig>({
  fields: {
    name: {
      value: (holding: Holding) => {
        if (holding?.symbolName) {
          return holding?.symbolName;
        }

        if (holding?.importRawData && holding?.importRawData['description']) {
          return holding?.importRawData['description'];
        }

        return '??';
      },
    },
    symbolName: {},
    buyQty: {
      justify: 'right',
    },
    currentTotalPrice: {
      private: true,
      value: (row: Holding) => (!row.lastPrice ? null : row.lastPrice.price * row.openQty),
      format: 'currency',
      justify: 'right',
    },
    currentAvgPrice: {
      value: (row: Holding) => {
        return !row.lastPrice ? null : row.lastPrice.price;
      },
      format: 'currency',
      justify: 'right',
      classes: 'text-gray-500',
    },
    lastBuyAt: {
      format: 'date',
      classes: 'text-gray-500',
      width: '100px',
    },
    lastSellAt: {
      format: 'date',
      classes: 'text-gray-500',
      width: '100px',
    },
    openQty: {
      format: value => (value !== 0 ? value : ''),
    },
    openTotalPrice: {
      private: true,
      format: 'currency',
      justify: 'right',
    },
    openAvgPrice: {
      format: 'currency',
      justify: 'right',
      classes: 'text-gray-500',
    },
    openPL: {
      format: 'range',
      justify: 'right',
      value: (row: Holding): RangeValue => {
        if (!row.lastPrice || row.openAvgPrice === 0) {
          return null;
        }

        return {
          from: row.openQty * row.openAvgPrice,
          to: row.openQty * row.lastPrice.price,
          currency: row.currency,
        };
      },
    },
    openPLPercent: {
      format: 'range',
      justify: 'right',
      value: (row: Holding): RangeValue => {
        if (!row.lastPrice || row.openAvgPrice === 0) {
          return null;
        }

        return {
          from: row.openQty * row.openAvgPrice,
          to: row.openQty * row.lastPrice.price,
          currency: row.currency,
        };
      },
    },
    closedQty: {
      format: value => (value !== 0 ? value : ''),
      justify: 'right',
    },
    closedAvgPrice: {
      format: 'money',
      justify: 'right',
    },
    closedTotalPrice: {
      private: true,
      format: 'currency',
      justify: 'right',
    },
    closedPL: {
      format: 'range',
      justify: 'right',
      value: (row: Holding): RangeValue => {
        if (row.closedQty === 0) {
          return null;
        }

        return {
          from: row.closedQty * row.buyAvgPrice,
          to: row.closedQty * row.closedAvgPrice,
          currency: row.currency,
        };
      },
    },
    dayPLChange: {
      justify: 'right',
      format: 'percent',
      value: (row: Holding) => {
        if (!row.lastPrice || row.lastPrice.price === 0) {
          return null;
        }

        return row.lastPrice.previousClose / row.lastPrice.price - 1;
      },
    },
    weight: {
      format: 'percent',
      justify: 'right',
      value: (row: Holding) => {
        if (!row.lastPrice) {
          return 0;
        }
        // @todo currency
        return props.totalOpen === 0 ? 0 : (row.openQty * row.lastPrice.open) / props.totalOpen;
      },
    },
  },
  tableLayoutCollection: props.tableLayout,
  settings: {
    actions: false,
    translationPrefix: 'holdings.table',
    locale: userStore.state.user.locale,
  },
  search: {
    handler: (searchString, holding: Holding) => {
      const searchVal = searchString.toLowerCase();

      if (holding.symbolName && holding.symbolName.toLowerCase().startsWith(searchVal)) {
        return true;
      }

      return holding.symbol && holding.symbol.name.toLowerCase().includes(searchVal);
    },
  },
});
</script>
