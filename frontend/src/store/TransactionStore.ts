// import {IndexedDB} from './base/IndexedDB'
import { Account, Transaction } from '/@common/models'
import { Query } from '/@common/Query'
import { useSidebar } from 'hooks/useSidebar'
import { defineStore } from 'pinia'

// const db = new IndexedDB('companyProfile')


export const useTransactionStore = defineStore({
  // name of the store
  id: 'transaction',

  state: () => ({
    subscriptionPromise : null,
    liveSubscription    : null,
    transactions        : [],
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
    async _init () {
      const q               = Query.create(Transaction)
      q.limit(100000)
      q.descending('executedAt')
      q.include('symbol')
      this.liveSubscription = await q.liveQuery(this.transactions, (obj, event) => {
        console.log(`transaction ${event ? event : 'init'} - ${obj.id}`, obj, this.transactions.length)
      })
    },
    async subscribe () {
      if (this.subscriptionPromise) {
        return this.subscriptionPromise
      }

      this.subscriptionPromise = this._init()

      return this.subscriptionPromise
    },
    reset () {
      // `this` is the store instance
      this.transactions = []
    },
  },
})
