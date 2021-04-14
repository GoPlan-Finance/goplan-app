// import {IndexedDB} from './base/IndexedDB'
import { Account } from '/@common/models'
import { Query } from '/@common/Query'
import { defineStore } from 'pinia'

// const db = new IndexedDB('companyProfile')

export const useAccountStore = defineStore({
  id: 'account',

  state: () => ({
    liveSubscription : null,
    accounts         : [] as Account[],
  }),
  actions: {
    async subscribe () {
      if (this.liveSubscription) {
        return
      }

      const q               = Query.create(Account)
      q.limit(100000)
      q.descending('updatedAt')
      this.liveSubscription = await q.liveQuery(this.accounts)
    },
    reset () {
      this.accounts = []
    },
  },
})
