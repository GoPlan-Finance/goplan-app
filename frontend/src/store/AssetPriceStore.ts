// import {IndexedDB} from './base/IndexedDB'
import { AssetPrice, AssetSymbol } from '@common/models';
import { Query } from '@goplan-finance/utils';
import { defineStore } from 'pinia';
// const db = new IndexedDB('companyProfile')

export const useAssetPriceStore = defineStore({
  // name of the store
  id: 'assetPrice',

  state: () => ({
    liveSubscription: null,
    assetPrices: [],
  }),
  // optional getters
  getters: {},

  // optional actions
  actions: {
    async subscribe() {
      // if (this.liveSubscription) {
      //
      // }
      //
      // const q = Query.create(AssetPrice)
      // q.limit(1)
      // q.descending('recordedAt')
      // q.include('symbol')
      // this.liveSubscription = await q.liveQuery(this.assetPrices,assetPrice => {
      //
      // })
    },
    async watch(assetSymbols: AssetSymbol[], updateFn: LiveQueryUpdateFn<AssetPrice> = null) {
      if (this.liveSubscription) {
        await this.liveSubscription.unsubscribe();
      }

      const q = Query.create(AssetPrice);
      q.descending('recordedAt');
      q.include('symbol');
      q.containedIn('symbol', assetSymbols);

      this.liveSubscription = await q.liveQuery(this.assetPrices, updateFn);
    },

    reset() {
      // `this` is the store instance
      this.holdings = [];
    },
  },
});
