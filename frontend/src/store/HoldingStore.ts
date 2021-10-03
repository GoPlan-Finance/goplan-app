import { Holding } from '@common/models/Holding';
import { HoldingHelper } from '@store/Holding/HoldingHelper';
import { Query } from '@goplan-finance/utils';
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { useAssetPriceStore } from './';

interface StoreState {
  subscriptionPromise: Promise<void>;
  holdings: Holding[];
}

export const useHoldingStore = defineStore({
  // name of the store
  id: 'holding',

  state: (): StoreState => ({
    subscriptionPromise: null,
    holdings: [],
  }),
  getters: {},

  actions: {
    async _init() {
      HoldingHelper.createMissingHoldings().then(() => HoldingHelper.findOutdatedHoldings());

      const priceStore = useAssetPriceStore();
      await priceStore.subscribe();

      const symbols = ref([]);

      const q = Query.create(Holding).limit(9999);
      q.include('symbol');

      await q.liveQuery(this.holdings, async (holding, op) => {
        await HoldingHelper.maybeUpdateOutdated(holding);

        if (!holding.symbol) {
          return;
        }

        const index = symbols.value.findIndex(symbol => symbol.id === holding.symbol.id);

        if (op === 'deleted') {
          symbols.value.splice(index, 1);
        } else if (index === -1) {
          symbols.value.push(holding.symbol);
        } else {
          // no-op, already present
        }
      });

      watch(
        () => symbols,
        async () => {
          await priceStore.watch(symbols.value, assetPrice => {
            const holding: Holding = this.holdings.find(holding => {
              return holding.symbol && holding.symbol.id === assetPrice.symbol.id;
            });

            if (!holding) {
              return;
            }

            holding.lastPrice = assetPrice;
          });
        },
        {
          immediate: true,
        }
      );
    },
    async subscribe() {
      if (this.subscriptionPromise) {
        return this.subscriptionPromise;
      }

      this.subscriptionPromise = this._init();

      return this.subscriptionPromise;
    },

    reset() {
      // `this` is the store instance
      this.holdings = [];
    },
  },
});
