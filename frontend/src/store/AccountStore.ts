// import {IndexedDB} from './base/IndexedDB'
import { Account } from '/@common/models'
import { Query } from '/@common/Query'
import { defineStore } from 'pinia'


// const db = new IndexedDB('companyProfile')

interface StoreState {
  subscriptionPromise : Promise<void>
  accounts : Account[]
}


export const useAccountStore = defineStore({
  id: 'account',

  state: () : StoreState => ({
    subscriptionPromise : null,
    accounts            : [],
  }),
  actions: {
    async _init () {
      if (this.liveSubscription) {
        return
      }

      const q               = Query.create(Account)
      q.limit(100000)
      q.descending('updatedAt')
      this.liveSubscription = await q.liveQuery(this.accounts, (obj, event) => {
        console.log(`accounts ${event ? event : 'init'} - ${obj.id}`, obj)
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
      this.accounts = []
    },
  },
})
