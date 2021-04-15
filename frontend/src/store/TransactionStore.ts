// import {IndexedDB} from './base/IndexedDB'
import { Transaction } from '/@common/models'
import { Query } from '/@common/Query'
import { defineStore } from 'pinia'

// const db = new IndexedDB('companyProfile')


export const useTransactionStore = defineStore({
  // name of the store
  id: 'transaction',

  state: () => ({
    liveSubscription : null,
    transactions     : [],
  }),
  // optional getters
  getters: {
    // get (asset : AssetSymbol) {
    //
    //
    // },
    // use getters in other getters
    doubleCountPlusOne () {
      return this.doubleCount * 2
    },
  },
  // optional actions
  actions: {
    async subscribe () {
      if (this.liveSubscription) {
        return
      }

      const q               = Query.create(Transaction)
      q.limit(100000)
      q.descending('executedAt')
      q.include('symbol')
      this.liveSubscription = await q.liveQuery(this.transactions)
    },
    reset () {
      // `this` is the store instance
      this.transactions = []
    },
  },
})
