<template>
  <DataTable :config="config" :rows="rows">
    <template #field(symbolName)="{ value, row }">
      <AppLink v-if="row.symbol" :ticker="row.symbolName" class="font-bold" to="ticker_details">
        {{ value }}
      </AppLink>
      <span v-else>
        {{ value }}
      </span>
    </template>
    <template #field(name)="{ value, row }">
      <AppLink v-if="row.symbol" :ticker="row.symbolName" class="text-gray-500" to="ticker_details">
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
        type="total"
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
  </DataTable>
</template>

<script lang="ts">
import { Holding } from '@common/models/Holding';
import PriceChange from '@components/PriceChange.vue';
import { RangeValue, TableLayout, TableRow } from '@components/DataTable';
import DataTable from '@components/DataTable.vue';
import AppLink from '@components/router/AppLink.vue';
import { ArrayUtils } from '@goplan-finance/utils';
import dayjs from 'dayjs';
import { computed, defineComponent, PropType, reactive, toRefs } from 'vue';
import GLoadingSpinner from '@components/base/GLoadingSpinner.vue';
import GSkeleton from '@components/base/GSkeleton.vue';

export default defineComponent({
  components: {
    GSkeleton,
    GLoadingSpinner,
    PriceChange,
    DataTable,
    AppLink,
  },
  props: {
    rows: {
      type: Object as PropType<TableRow[]>,
      required: true,
    },
    tableLayout: {
      type: Object as PropType<TableLayout[]>,
      required: true,
    },
  },
  setup(props) {
    const totalOpen = computed(() =>
      ArrayUtils.sum<Holding>(props.rows, elem => elem.openQty * elem.lastPrice.open)
    );

    const data = reactive({
      config: {
        fields: {
          name: {
            value: (holding: Holding) => {
              return holding?.symbol?.name ?? holding?.importRawData?.description ?? '';
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
            format: 'money',
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
            format: 'money',
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
              // @todo currency
              return totalOpen.value === 0
                ? 0
                : (row.openQty * row.lastPrice.open) / totalOpen.value;
            },
          },
        },
        tableLayout: props.tableLayout,
        settings: {
          actions: false,
          translationPrefix: 'holdings.table',
        },
        search: {
          handler: (searchString, holding) => {
            const searchVal = searchString.toLowerCase();
            const tickerName = holding.symbolName;

            if (tickerName && tickerName.toLowerCase().startsWith(searchVal)) {
              return true;
            }

            // noinspection RedundantIfStatementJS
            if (holding.symbol && holding.symbol.name.toLowerCase().includes(searchVal)) {
              return true;
            }

            return false;
          },
        },
      },
    });

    return {
      ...toRefs(data),
      totalOpen,
      dayjs,
    };
  },
});
</script>
