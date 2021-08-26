/**
 *
 *
 *
 */
import { Account, AssetSymbol, Transaction } from '@common/models';
import { TransactionType } from '@common/models/Transaction';
import { Query } from '@utils/parse/Query';
import { StringUtils } from '@utils/StringUtils';

import { Mutex } from 'async-mutex';
import dayjs from 'dayjs';
import * as Papa from 'papaparse';

type LoggerFn = (i: number, msg: string) => void;

export interface CsvDataInterface {
  currency: string;
  date: string;
  price: string;
  quantity: string;
  fees: string;
  totalExcludingFees: string;
  type: TransactionType;
  account: Account;
  accountName: string;
  symbol: string;
  assetSymbol: AssetSymbol | null;
}

export class DefaultCSVImporter {
  mutex = new Mutex();

  accounts: Account[] | null = null;

  parseCSV(file): Promise<CsvDataInterface[]> {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.readAsText(file);
      Papa.parse(file, {
        header: true,
        complete({ data }) {
          resolve(data as CsvDataInterface[]);
        },
      });
    });
  }

  private async getOrCreateAccount(name: string): Promise<Account> {
    return await this.mutex.runExclusive(async () => {
      if (!this.accounts) {
        const q = new Query(Account);

        this.accounts = await q.find();
      }

      let account = this.accounts.find(account => account.name === name);

      if (account) {
        return account;
      }

      account = new Account();
      account.name = name;

      await account.save();
      this.accounts.push(account);

      return account;
    });
  }

  private async validateRow(row: CsvDataInterface): Promise<CsvDataInterface> {
    // date  type  symbol  quantity  price  fees  totalExcludingFees  currency  accountName  description

    if (!row.type || !row.date || !row.currency || !row.accountName) {
      throw '"date", "type", "currency", "accountName" fields are mandatory';
    }

    row.account = await this.getOrCreateAccount(row.accountName);
    row.quantity = row.quantity || null;
    row.symbol = row.symbol ? row.symbol.toUpperCase() : null;
    row.type = row.type.toLowerCase() as TransactionType;
    row.currency = row.currency.toUpperCase();

    if (!dayjs(row.date).isValid()) {
      throw 'The date format is invalid';
    }

    if (row.symbol && row.symbol.length) {
      row.assetSymbol = await AssetSymbol.fetchSymbolByTicker(row.symbol);

      if (!row.assetSymbol) {
        //        throw `Notice: Symbol ${row.symbol} not found.`
      }
    }

    const types = ['transfer', 'buy', 'sell', 'dividends', 'fees'];
    if (!types.includes(row.type)) {
      throw `'Type must be one of the following "${types.join('", "')}"`;
    }

    if (row.currency && row.assetSymbol && row.assetSymbol.currency !== row.currency) {
      throw `Currency "${row.currency}" does not match Asset Currency of "${row.assetSymbol.currency}"`;
    }

    if (!row.symbol && ['buy', 'sell', 'dividends'].includes(row.type)) {
      throw 'Symbol missing';
    }

    if (!row.totalExcludingFees && ['dividends', 'transfer'].includes(row.type)) {
      throw 'totalExcludingFees missing';
    }

    if (!row.quantity && ['buy', 'sell'].includes(row.type)) {
      throw 'quantity missing';
    }

    if (!row.price && ['buy', 'sell'].includes(row.type)) {
      throw 'price missing';
    }

    if (!row.fees && ['fees'].includes(row.type)) {
      throw 'fees missing';
    }

    if (
      row.totalExcludingFees &&
      parseFloat(row.totalExcludingFees) !== 0 &&
      ['fees'].includes(row.type)
    ) {
      throw 'totalExcludingFees must be empty';
    }

    const qty = parseFloat(row.quantity);
    if (['sell', 'buy'].includes(row.type) && qty < 0) {
      row.quantity = Math.abs(qty).toString(); // Some exports contains SELL -100
    }

    const totalExcludingFees = parseFloat(row.totalExcludingFees);
    if (['sell', 'buy'].includes(row.type) && totalExcludingFees < 0) {
      row.totalExcludingFees = Math.abs(totalExcludingFees).toString(); // Some exports contains SELL -100
    }

    return row;
  }

  async validateCSV(file: File, logger: LoggerFn): Promise<CsvDataInterface[]> {
    const validRows = [];

    const data: CsvDataInterface[] = await this.parseCSV(file);
    for (const [i, row] of Object.entries(data)) {
      try {
        validRows.push(await this.validateRow(row));

        logger(i, 'Valid');
      } catch (error) {
        logger(i, error);
      }
    }

    return validRows;
  }

  async importCSV(rows: CsvDataInterface[], logger: LoggerFn) {
    for (const [i, row] of Object.entries(rows)) {
      try {
        const transaction = new Transaction();

        transaction.executedAt = dayjs(row.date).toDate();
        transaction.currency = row.currency;
        transaction.account = row.account;
        transaction.price = StringUtils.toFloatOrNull(row.price);
        transaction.quantity = StringUtils.toFloatOrNull(row.quantity);
        transaction.fees = StringUtils.toFloatOrNull(row.fees);
        transaction.totalExcludingFees = StringUtils.toFloatOrNull(row.totalExcludingFees);
        transaction.symbol = row.assetSymbol;
        transaction.type = row.type;
        transaction.importRawData = row;

        if (!row.assetSymbol && row.symbol) {
          transaction.symbolName = row.symbol;

          transaction.importStatus = {
            errors: [{ missingSymbol: row.symbol }],
          };
        }

        await transaction.save();
        logger(i, 'Imported...');
      } catch (error) {
        logger(i, error);
      }
    }
  }
}
