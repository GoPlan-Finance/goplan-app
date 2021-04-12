/**
 *
 *
 *
 */
import { Account, AssetSymbol, Transaction } from '/common/models'
import { TransactionType } from '/common/models/Transaction'
import { Query } from '/common/Query'
import { StringUtils } from '/common/utils'
import * as dayjs from 'dayjs'
import * as Papa from 'papaparse'


export interface CsvDataInterface {
  currency : string
  date : string
  price : string
  quantity : string
  fees : string
  totalExcludingFees : string
  type : TransactionType,
  account : Account,
  accountName : string,
  symbol : string
  assetSymbol : AssetSymbol | null
}


export class DefaultCSVImporter {

  accounts : Account[] | null = null

  parseCSV (file) : Promise<CsvDataInterface[]> {
    return new Promise(resolve => {
      const reader = new FileReader()
      reader.readAsText(file)
      Papa.parse(file, {
        header: true,
        complete ({data}) {

          resolve(data as CsvDataInterface[])
        },
      })
    })
  }

  private async getOrCreateAccount (name : string) : Promise<Account> {

    if (!this.accounts) {
      const q = new Query(Account)

      this.accounts = await q.find()
    }

    let account = this.accounts.find(account => account.name === name)

    if (account) {
      return account
    }

    account      = new Account()
    account.name = name
    return await account.save()
  }

  private async validateRow (row) : Promise<CsvDataInterface> {
    // date  type  symbol  quantity  price  fees  totalExcludingFees  currency  accountName  description

    if (!row.type || !row.date || !row.currency || !row.accountName) {
      throw  '"date", "type", "currency", "accountName" fields are mandatory'
    }

    row.account  = await this.getOrCreateAccount(row.accountName)
    row.quantity = row.quantity || null
    row.symbol   = row.symbol ? row.symbol.toUpperCase() : null
    row.type     = row.type.toLowerCase() as TransactionType
    row.currency = row.currency.toUpperCase()

    if (!dayjs(row.date).isValid()) {
      throw 'The date format is invalid'
    }

    if (row.symbol && row.symbol.length) {
      row.assetSymbol = await AssetSymbol.fetchSymbolByTicker(row.symbol)

      if (!row.assetSymbol) {
        //        throw `Notice: Symbol ${row.symbol} not found.`
      }
    }

    const types = [
      'transfer', 'buy', 'sell', 'dividends', 'fees',
    ]
    if (!types.includes(row.type)) {
      throw `'Type must be one of the following "${types.join('", "')}"`
    }

    if (row.currency && row.assetSymbol && row.assetSymbol.currency !== row.currency) {
      throw `Currency "${row.currency}" does not match Asset Currency of "${row.assetSymbol.currency}"`
    }

    if (!row.symbol && [
      'buy', 'sell', 'dividends',
    ].includes(row.type)) {
      throw 'Symbol missing'
    }

    if (!row.totalExcludingFees && [
      'dividends', 'transfer',
    ].includes(row.type)) {
      throw 'totalExcludingFees missing'
    }

    if (!row.quantity && [
      'buy', 'sell',
    ].includes(row.type)) {
      throw 'quantity missing'
    }

    if (!row.price && [
      'buy', 'sell',
    ].includes(row.type)) {
      throw 'price missing'
    }

    if (!row.fees && [
      'fees',
    ].includes(row.type)) {
      throw 'fees missing'
    }

    if (row.totalExcludingFees && row.totalExcludingFees !== 0 && [
      'fees',
    ].includes(row.type)) {
      throw 'totalExcludingFees must be empty'
    }

    if (row.type === 'sell' && row.quantity < 0) {
      row.quantity = Math.abs(row.quantity)  // Some exports contains SELL -100
    }

    return row
  }

  async validateCSV (file, logger) : Promise<CsvDataInterface[]> {

    const validRows = []

    const data : CsvDataInterface[] = await this.parseCSV(file)
    for (const [
      i, row
    ] of Object.entries(data)) {
      try {
        validRows.push(
          await this.validateRow(row),
        )

        logger(i, 'Valid')
      } catch (error) {
        logger(i, error)
      }
    }

    return validRows
  }


  async importCSV (rows : CsvDataInterface[], logger) {

    for (const [
      i, row
    ] of Object.entries(rows)) {
      try {
        const transaction = new Transaction()

        transaction.executedAt         = dayjs(row.date).toDate()
        transaction.currency           = row.currency
        transaction.account            = row.account
        transaction.price              = StringUtils.toNumberOrNull(row.price)
        transaction.quantity           = StringUtils.toNumberOrNull(row.quantity)
        transaction.fees               = StringUtils.toNumberOrNull(row.fees)
        transaction.totalExcludingFees = StringUtils.toNumberOrNull(row.totalExcludingFees)
        transaction.symbol             = row.assetSymbol
        transaction.type               = row.type
        transaction.importRawData      = row


        if (!row.assetSymbol) {
          transaction.importStatus = {
            errors: [
              {missingSymbol: row.symbol},
            ],
          }
        }

        await transaction.save()
        logger(i, 'Imported...')

      } catch (error) {
        logger(i, error)
      }
    }
  }

}
