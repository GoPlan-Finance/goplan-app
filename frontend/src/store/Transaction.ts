import { defineStore } from 'pinia'
import {IndexedDB} from "./base/IndexedDB";
import {AssetSymbol} from "../../../common/models";
import {Transaction} from "../models";

const db = new IndexedDB('companyProfile')


export const useTransactionStore = defineStore({
  // name of the store
  id    : 'transaction',

  state : () => ({
    subscription : null,
    transactions: [],
  }),
  // optional getters
  getters: {
    get (asset : AssetSymbol) {





    },
    // use getters in other getters
    doubleCountPlusOne () {
      return this.doubleCount * 2
    },
  },
  // optional actions
  actions: {
    async subscribe(){
      if(this.subscription){
        await this.subscription.unsubscribe()
      }

      this.subscription = await Transaction.liveQuery(new Parse.Query(Transaction) ,  this.transactions  ,obj => {

      })

    },
    reset () {
      // `this` is the store instance
      this.transactions = []
    },
  },
})
