import { Holding } from '@common/models/Holding';
import { HoldingHelper } from '@store/Holding/HoldingHelper';
import { ArrayUtils, Query } from '@goplan-finance/utils';
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { useAssetPriceStore } from './';

interface StoreState {
  subscriptionPromise: Promise<void>;
  holdings: Holding[];
}

export interface TypeAllocation {
  type: string;
  initialValue: number;
  currentValue: number;
}

export const useHoldingStore = defineStore({
  // name of the store
  id: 'holding',

  state: (): StoreState => ({
    subscriptionPromise: null,
    holdings: [],
  }),
  getters: {
    /**
     * Get an array of unique symbol types (Common Stock, Fund, ETF, ...)
     */
    types(): string[] {
      return [...new Set<string>(this.holdings.map((holding: Holding) => holding.symbol.type))];
    },

    typeAllocations(): TypeAllocation[] {
      return this.types.map(type => {
        let initialValue = 0;
        let currentValue = 0;

        this.holdings.forEach((holding: Holding) => {
          if (holding.symbol.type === type) {
            initialValue += holding.openTotalPrice;
            currentValue += holding.lastPrice?.price * holding.openQty;
          }
        });

        return {
          type,
          initialValue,
          currentValue,
        };
      });
    },

    openHoldings(): Holding[] {
      return this.holdings.filter((holding: Holding) => holding.openQty !== 0);
    },

    hasOpenHoldings(): boolean {
      return this.openHoldings.length > 0;
    },

    closedHoldings(): Holding[] {
      return this.holdings.filter((holding: Holding) => holding.openQty === 0);
    },

    totalBookValue(): number {
      return ArrayUtils.sum<Holding>(this.holdings, elem => {
        return elem.openTotalPrice; // TODO: Handle different currencies
      });
    },

    totalOpen(): number {
      return ArrayUtils.sum<Holding>(this.holdings, elem => {
        if (!elem.lastPrice) {
          return;
        }
        return elem.openQty * elem.lastPrice.open; // TODO: Handle different currencies
      });
    },

    totalChangeValue(): number {
      return this.totalOpen - this.totalBookValue;
    },

    totalChangePercent(): number {
      return this.totalChangeValue / this.totalBookValue;
    },
  },

  actions: {
    async _init() {
      HoldingHelper.createMissingHoldings().then(() => HoldingHelper.findOutdatedHoldings());

      const priceStore = useAssetPriceStore();
      await priceStore.subscribe();

      const symbols = ref([]);

      const q = Query.create(Holding);
      q.limit(9999);
      q.include('symbol');

      await q.liveQuery(this.holdings, async (holding, op) => {
        await HoldingHelper.maybeUpdateOutdated(holding);

        if (!holding.symbol) {
          return;
        }

        const index = symbols.value.findIndex(symbol => symbol.id === holding.symbol.id);

        if (op === 'delete') {
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
