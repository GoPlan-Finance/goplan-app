import { Holding, Transaction } from '/@common/models'
import { HoldingHistory } from '/@common/models/HoldingHistory'
import { Query } from '/@common/Query'
import { CandleData } from '/@components/Charts/CandlestickChart'
import { Mutex } from 'async-mutex'
import * as dayjs from 'dayjs'
import { useTransactionStore } from '../'


const holdingMutex = new Mutex()


export class HoldingHistoryHelper {


  private static dateGenerator (holding : Holding, transactions : Transaction[]) {

    if (transactions.length === 0) {
      return
    }

    const start = dayjs(transactions[0].executedAt).startOf('day')
    const end   = dayjs(transactions[transactions.length - 1].executedAt).endOf('day')

    const now = dayjs().endOf('day')

    if (start.isAfter(end)) {
      throw `start date "${start}" must be before the end date "${end}"`
    }

    const deltas = []
    for (const transaction of transactions) {

      if (![
        'buy', 'sell'
      ].includes(transaction.type.toLowerCase())) {
        continue
      }

      const qty  = transaction.quantity * ((transaction.type.toLowerCase() === 'sell') ? -1 : 1)
      const last = deltas.length ? deltas[deltas.length - 1].openQty : 0

      deltas.push({
        executedAt : dayjs(transaction.executedAt).startOf('day'),
        transaction,
        openQty    : last + qty,
      })
    }

    const results = []
    let current   = null
    for (let i = 1; i < deltas.length; ++i) {
      current   = deltas[i - 1]
      const end = deltas[i]

      while (current.executedAt.isBefore(end.executedAt.endOf('day'))) {
        results.push({...current})

        current.executedAt = current.executedAt.add(1, 'day')
      }
    }

    if (!current || current.openQty === 0) {
      return results
    }

    current = deltas[deltas.length - 1]
    while (current.executedAt.isBefore(now)) {
      results.push({...current})

      current.executedAt = current.executedAt.add(1, 'day')
    }

    return results
  }

  public static async updateHistory (holding : Holding, transactions : Transaction[]) : Promise<void> {

    if (!holding.symbol) {
      return
    }

    transactions.sort((a, b) => a.executedAt.getTime() - b.executedAt.getTime())

    const dates = HoldingHistoryHelper.dateGenerator(holding, transactions)

    if (dates.length === 0) {
      return
    }

    const openQtys = []
    for (const date of dates) {
      openQtys[date.executedAt.format('YYYY-MM-DD')] = date.openQty
    }

    const eod : CandleData[] = await Parse.Cloud.run('Assets--GetEndOfDay', {
      resolution    : 'day',
      from          : dates[0].executedAt.toISOString(),
      to            : dates[dates.length - 1].executedAt.toISOString(),
      assetSymbolId : holding.symbol.id,
    })


    const existingPrices = await Query.create(HoldingHistory).findBy({
      period: 'day',
      holding,
    })


    const prices = []
    for (const elem of eod) {
      const openQty = openQtys[dayjs(elem.date).format('YYYY-MM-DD')]

      if (openQty === undefined) {
        continue
      }

      // const existingPrice = existingPrices.find(price => )

      const price = new HoldingHistory()

      price.openQty = openQty
      price.low     = openQty * elem.low
      price.high    = openQty * elem.high
      price.open    = openQty * elem.open
      price.close   = openQty * elem.close
      price.low     = openQty * elem.low

      await price.save()
    }

    console.table(prices.map(price => price._decryptedReadCache))
    //    return prices

  }

}
