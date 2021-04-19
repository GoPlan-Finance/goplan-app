// import {IndexedDB} from './base/IndexedDB'
import { Transaction } from '/@common/models'
import { Holding } from '/@common/models/Holding'
import { ArrayUtils } from '/@common/utils'
import * as dayjs from 'dayjs'
import { defineStore } from 'pinia'
import { watch, computed} from 'vue'
import { useAssetPriceStore, useTransactionStore } from './'
// const db = new IndexedDB('companyProfile')

export const useHoldingStore = defineStore({
  // name of the store
  id: 'holding',

  state: () => ({
    subscriptionPromise : null,
    liveSubscription    : null,
    holdings            : [],
  }),
  // optional getters
  getters: {},


  // optional actions
  actions: {
    updateHoldings () {

      const transactionsStore = useTransactionStore()

      const holdings = ArrayUtils.groupBy<Transaction>(
        transactionsStore.transactions.filter(transaction => {

          if (!transaction.type) {
            return false
          }

          return [
            'buy', 'sell',
          ].includes(transaction.type.toLowerCase())

        }), transaction => {
          const symbol = transaction.getTickerName()

          return symbol ? symbol : 'N/A'
        })


      this.holdings = Object.entries(holdings).map(([
        symbolName, transactions,
      ]) => {

        //const symbol = await CacheableQuery.create(AssetSymbol).getObjectById()
        const transaction = transactions.length > 0 ? transactions[0] : null
        const symbol      = transactions.length > 0 ? transactions[0].symbol : null
        const holding     = new Holding()

        // if (symbol) {
        //   priceStore.watch(symbol)
        //   holding.lastPrice = priceStore.getPrice(symbol)
        // }
        holding.lastBuy    = null
        holding.symbol     = symbol
        holding.symbolName = symbolName
        holding.currency   = symbol ? symbol.currency : (transaction ? transaction.currency : null)

        holding.openQty        = 0
        holding.openAvgPrice   = 0
        holding.openTotalPrice = 0

        holding.closedQty        = 0
        holding.closedAvgPrice   = 0
        holding.closedTotalPrice = 0

        transactions.forEach(transaction => {
          if (transaction.type.toLowerCase() === 'buy') {
            holding.openQty        += transaction.quantity
            holding.openTotalPrice += transaction.totalExcludingFees

            if (!holding.lastBuy || dayjs(holding.lastBuy).unix() < dayjs(transaction.executedAt).unix()) {
              holding.lastBuy = transaction.executedAt
            }

          }

          if (transaction.type.toLowerCase() === 'sell') {
            holding.closedQty        += transaction.quantity
            holding.closedTotalPrice += transaction.totalExcludingFees

            // row.openQty -= transaction.quantity
            // row.openTotalPrice -= transaction.totalExcludingFees
          }
        })

        if (holding.openQty) {
          holding.openAvgPrice = holding.openTotalPrice / (holding.openQty)
        } else {
          holding.openTotalPrice = null
          holding.openAvgPrice   = null
        }

        if (holding.closedQty) {
          holding.openQty        -= holding.closedQty
          holding.openTotalPrice -= holding.closedTotalPrice

          holding.closedAvgPrice = holding.closedTotalPrice / holding.closedQty
        } else {
          holding.closedTotalPrice = null
          holding.closedAvgPrice   = null
        }

        return holding
      })


    },
    async _init () {

      const transactionStore = useTransactionStore()
      const priceStore       = useAssetPriceStore()

      await transactionStore.subscribe()
      await priceStore.subscribe()

      const asdf = computed(() => {

        console.log('HoldingStore computed', transactionStore.transactions.length)
        return transactionStore.transactions
      })

      watch(() => transactionStore.transactions, async () => {

        console.log('updateHoldings', transactionStore.transactions.length)

        this.updateHoldings()

        const symbols = this.holdings.filter(holding => {
          return holding.symbol !== null
        }).map(holding => holding.symbol)

        await priceStore.watch(symbols, assetPrice => {
          console.log('price', assetPrice)

          const holding : Holding = this.holdings.find(holding => {
            return holding.symbol && holding.symbol.id === assetPrice.symbol.id
          })

          console.log(holding.symbolName, assetPrice)
          holding.lastPrice = assetPrice
        })

      },
      {
        immediate: true,
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
      this.holdings = []
    },
  }
  ,
})
