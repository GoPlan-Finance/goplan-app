// import {IndexedDB} from './base/IndexedDB'
import { Account, Transaction } from '/common/models'
import { Query } from '/common/Query'
import { defineStore } from 'pinia'

// const db = new IndexedDB('companyProfile')


export const useAccountStore = defineStore({
  // name of the store
  id: 'account',

  state: () => ({
    liveSubscription : null,
    accounts         : [],
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

      const q               = Query.create(Account)
      q.limit(100000)
      q.descending('updatedAt')
      this.liveSubscription = await q.liveQuery(this.accounts, obj => {
        console.log(this.$id, obj)
      })
    },
    reset () {
      // `this` is the store instance
      this.transactions = []
    },
  },
})
