<template>
  <HeadlineActions :headline="$t('holdings.headline')">
    <BuySellAsset />
  </HeadlineActions>
  <template v-if="holdingStore.holdings.length">
    <!--  <h1 class="text-gray-700 text-2xl items-center">Active Positions</h1>-->
    <HoldingsTable
      :holdings="holdingStore.openHoldings"
      :total-open="holdingStore.totalOpen"
      :total-book-value="holdingStore.totalBookValue"
      :table-layout="openTableLayout"
    />

    <template v-if="holdingStore.closedHoldings.length">
      <br />
      <br />
      <h1 class="text-gray-700 text-2xl items-center">Previous Positions</h1>

      <HoldingsTable
        :holdings="holdingStore.closedHoldings"
        :total-open="0"
        :total-book-value="holdingStore.totalBookValue"
        :table-layout="closedTableLayout"
      />
    </template>
  </template>
  <GEmptyState v-else>
    {{ t('No Holdings') }}
  </GEmptyState>
</template>

<script setup lang="ts">
import BuySellAsset from '@components/TransactionModal.vue';
import HeadlineActions from '@components/HeadlineActions.vue';
import HoldingsTable from '@components/Holdings/HoldingsTable.vue';
import { Screens } from '@/hooks/useScreensize';
import { useHoldingStore } from '@/store';
import GEmptyState from '@components/base/GEmptyState.vue';
import { useI18n } from 'vue-i18n';
import { TableLayoutCollection } from '@components/DataTable/useTableLayout';

const { t } = useI18n();

const openTableLayout: TableLayoutCollection = {
  [Screens.DEFAULT]: [
    ['symbolName', 'openQty'],
    ['currentTotalPrice', 'openPLPercent'],
  ],
  [Screens.SM]: [
    ['symbolName', 'name'],
    ['openQty', 'lastBuyAt'],
    ['openTotalPrice', 'openAvgPrice'],
    ['currentTotalPrice', 'currentAvgPrice'],
    ['openPL', 'openPLPercent'],
  ],
  [Screens.MD]: [
    ['symbolName', 'name'],
    ['openQty', 'lastBuyAt'],
    ['openTotalPrice', 'openAvgPrice'],
    ['currentTotalPrice', 'currentAvgPrice'],
    ['openPL', 'openPLPercent'],
    ['weight'],
  ],
};

const closedTableLayout: TableLayoutCollection = {
  [Screens.DEFAULT]: [['symbolName'], ['closedPL']],
  [Screens.SM]: [['symbolName', 'name'], ['lastSellAt'], ['closedPL']],

  [Screens.DEFAULT]: [['symbolName'], ['currentTotalPrice']],
  [Screens.SM]: [
    ['symbolName', 'name'],
    ['lastBuyAt'],
    [],
    ['currentTotalPrice', 'currentAvgPrice'],
    ['openPL', 'openPLPercent'],
  ],
  [Screens.MD]: [
    ['symbolName', 'name'],
    ['closedQty', 'lastBuyAt'],
    ['closedTotalPrice', 'closedAvgPrice'],
    ['closedPL'],
    ['weight'],
  ],
};

const holdingStore = useHoldingStore();
await holdingStore.subscribe();
</script>
