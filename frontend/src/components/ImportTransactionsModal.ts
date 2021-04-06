/**
 *
 *
 *
 */

import * as dayjs from 'dayjs'
import * as Papa from 'papaparse'
import {AssetSymbol} from '../../../common/models'
import {CompanyProfile} from '../../../backend/src/cloud/DataProviders/providers/types'
import {Transaction} from '../models'


export interface CsvDataInterface {
    currency: string
    date: string
    price: number
    quantity: number
    type: string
    symbol: string
    assetSymbol: AssetSymbol | undefined
}

function parseCSV (file): Promise<CsvDataInterface[]> {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.readAsText(file)
    Papa.parse(file, {
      header: true,
      complete ({data}) {

        resolve(data as CsvDataInterface[])
      }
    })

  })
}


export async function validateCSV (file, logger): Promise<CsvDataInterface[]> {

  const validRows = []

  const data: CsvDataInterface[] = await parseCSV(file)
  // currency: "CAD"
  // date: "2021-02-01 12:00:00 AM"
  // price: "0"
  // quantity: "0"
  // symbol: ""
  // type: "DEP"

  for (const [
    i, row
  ] of Object.entries(data)) {

    try {

      if (!row.type || !row.type) {
        //logger(i, 'Type missing')
        continue
      }

      row.type = row.type.toLowerCase()

      if ([
        'buy', 'sell'
      ].indexOf(row.type) === -1) {
        logger(i, 'Type must be either BUY or SELL')
        continue
      }

      if (!row.price) {
        logger(i, 'Missing Price')
        continue
      }
      if (!row.quantity) {
        logger(i, 'Missing Quantity')
        continue
      }

      if (row.type === 'sell' && row.quantity < 0) {
        row.quantity = Math.abs(row.quantity)  // Some exports contains SELL -100
      }

      const symbol = await AssetSymbol.fetchSymbolByTicker(row.symbol)

      if (!symbol) {
        logger(i, `Symbol ${row.symbol} not found.`)
        continue
      }

      row.assetSymbol = symbol

      const profile: CompanyProfile = await Parse.Cloud.run('Assets--GetProfile', {
        assetSymbolId: symbol.id
      })

      if (!profile) {
        logger(i, `Company profile ${row.symbol} not found.`)
        continue
      }


      if (row.currency && profile.currency.toLowerCase() !== row.currency.toLowerCase()) {
        logger(i, `Currency "${row.currency}" does not match Asset Currency of "${profile.currency}"`)
        continue
      }


      validRows.push(row)

    } catch (error) {
      logger(i, error)
    }
  }

  return validRows
}


export async function importCSV (rows: CsvDataInterface[], logger) {


  for (const [
    i, row
  ] of Object.entries(rows)) {
    try {
      const transaction = new Transaction()

      // currency: string
      // date: string
      // price: number
      // quantity: number
      // symbol: string
      // type: string

      transaction.currency   = row.currency
      transaction.executedAt = dayjs(row.date).toDate()
      transaction.price      = row.price
      transaction.quantity   = row.quantity
      transaction.symbol     = row.assetSymbol
      transaction.type       = row.type

      await transaction.save()
      logger(i, 'Imported...')

    } catch (error) {
      logger(i, error)
    }
  }


}
