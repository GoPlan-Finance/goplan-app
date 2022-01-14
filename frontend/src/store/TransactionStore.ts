// import {IndexedDB} from './base/IndexedDB'
import { Transaction } from '@common/models';
import { Query } from '@goplan-finance/utils';
import { defineStore } from 'pinia';

// const db = new IndexedDB('companyProfile')

interface StoreState {
  subscriptionPromise: Promise<void>;
  transactions: Transaction[];
}

export const useTransactionStore = defineStore({
  // name of the store
  id: 'transaction',

  state: (): StoreState => ({
    subscriptionPromise: null,
    transactions: [],
  }),
  // optional getters
  getters: {
    // get (asset : AssetSymbol) {
    //
    //
    // },
    // use getters in other getters
    doubleCountPlusOne() {
      return this.doubleCount * 2;
    },
  },
  // optional actions
  actions: {
    async _init() {
      const q = Query.create(Transaction);
      q.limit(100000);
      q.descending('executedAt');
      q.include('symbol');
      q.include('account');

      await q.liveQuery(this.transactions);
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
      this.transactions = [];
    },
  },
});
