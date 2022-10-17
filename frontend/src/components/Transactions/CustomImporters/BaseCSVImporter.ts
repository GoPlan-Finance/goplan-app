/**
 *
 *
 *
 */
import { Account, AssetSymbol, Transaction } from '@models';
import { TransactionType } from '@models/Transaction';
import { Query, StringUtils } from '@goplan-finance/utils';

import { Mutex } from 'async-mutex';
import dayjs from 'dayjs';
import * as Papa from 'papaparse';
import { Currencies } from 'ts-money';

type LoggerFn = (i: string, msg: string) => void;

export interface CsvDataInterface {
  currency: string;
  date: dayjs.Dayjs;
  price: number | null;
  quantity: number | null;
  fees: number | null;
  totalExcludingFees: number | null;
  type: TransactionType;
  accountName: string;
  symbol: string;
}

export interface ImportRowDataInterface extends CsvDataInterface {
  account?: Account;
  assetSymbol?: AssetSymbol;
}

const symbolSearchCache = [];

export abstract class BaseCSVImporter {
  abstract prepareRow(row: unknown): Promise<CsvDataInterface>;

  mutex = new Mutex();

  accounts: Account[] | null = null;

  async parseCSV(file): Promise<unknown[]> {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.readAsText(file);
      Papa.parse(file, {
        header: true,
        complete({ data }) {
          resolve(data as unknown[]);
        },
      });
    });
  }

  private async getOrCreateAccount(name: string, currency: string | null): Promise<Account> {
    return await this.mutex.runExclusive(async () => {
      if (!this.accounts) {
        const q = new Query(Account);

        this.accounts = await q.find();
      }

      let account = this.accounts.find(account => account.name === name || account.id === name);

      if (!account) {
        if (!currency) {
          throw `You need to specify a currency for the account "${name}. To do so, create an account first, then retry the import`;
        }

        account = new Account();
        account.name = name;
        account.currency = currency;
        await account.save();
        this.accounts.push(account);
      }

      return account;
    });
  }

  protected async validateRow(unsafeRow: CsvDataInterface): Promise<ImportRowDataInterface> {
    if (!unsafeRow.accountName) {
      throw '"accountName" fields are mandatory';
    }
    if (!unsafeRow.type) {
      throw '"type" fields are mandatory';
    }
    if (!unsafeRow.date) {
      throw '"date" fields are mandatory';
    }

    const row: ImportRowDataInterface = {
      accountName: unsafeRow.accountName.trim(),
      currency: unsafeRow.currency?.toUpperCase(),
      quantity: unsafeRow.quantity || null,
      type: unsafeRow.type.toLowerCase() as TransactionType,
      symbol: unsafeRow.symbol ? unsafeRow.symbol.toUpperCase().trim() : null,
      date: unsafeRow.date,
      price: unsafeRow.price,
      fees: unsafeRow.fees,
      totalExcludingFees: unsafeRow.totalExcludingFees,
    };

    row.account = await this.getOrCreateAccount(row.accountName, row.currency);

    // if (!row.account.currency) {
    //   throw '"date", "type", "currency", "accountName" fields are mandatory';
    // }

    if (!row.date?.isValid()) {
      throw 'The date format is invalid';
    }

    if (row.symbol && row.symbol.length) {
      row.assetSymbol = await AssetSymbol.fetchSymbolByTicker(row.symbol);

      if (!row.assetSymbol) {
        // This should most likely be moved into AssetSymbol.AfterFind trigger.
        const searchedSymbols: AssetSymbol[] =
          symbolSearchCache[row.symbol] ??
          (await Parse.Cloud.run('Assets--Search', {
            query: row.symbol,
          }));

        symbolSearchCache[row.symbol] = searchedSymbols;
        const exactMatch = searchedSymbols.find(symbol => symbol.tickerName === row.symbol);
        if (exactMatch) {
          row.assetSymbol = exactMatch;
        }
      }
      //        throw `Notice: Symbol ${row.symbol} not found.`
    }

    const types = ['transfer', 'buy', 'sell', 'dividends', 'fees', 'split'];
    if (!types.includes(row.type)) {
      throw `'Type must be one of the following "${types.join('", "')}", got "${row.type}"`;
    }

    if (row.currency && row.assetSymbol && row.assetSymbol.currency !== row.currency) {
      throw `Currency "${row.currency}" does not match Asset Currency of "${row.assetSymbol.currency}"`;
    }

    if (!row.symbol && ['buy', 'sell', 'dividends', 'split'].includes(row.type)) {
      throw 'Symbol missing';
    }

    if (!row.totalExcludingFees && ['dividends', 'transfer'].includes(row.type)) {
      throw 'totalExcludingFees missing';
    }

    if (!row.quantity && ['buy', 'sell', 'split'].includes(row.type)) {
      throw 'quantity missing';
    }

    if (!row.price && ['buy', 'sell'].includes(row.type)) {
      throw 'price missing';
    }

    if (!row.fees && ['fees'].includes(row.type)) {
      throw 'fees missing';
    }

    if (row.totalExcludingFees && row.totalExcludingFees !== 0 && ['fees'].includes(row.type)) {
      throw 'totalExcludingFees must be empty';
    }

    // if (['sell', 'buy'].includes(row.type) && row.quantity < 0) {
    //   row.quantity = Math.abs(row.quantity); // Some exports contains SELL -100
    // }

    // if (['sell', 'buy'].includes(row.type) && row.totalExcludingFees < 0) {
    //   row.totalExcludingFees = Math.abs(row.totalExcludingFees); // Some exports contains SELL -100
    // }

    return row;
  }

  async validateCSV(file: File, logger: LoggerFn): Promise<ImportRowDataInterface[]> {
    const validRows: ImportRowDataInterface[] = [];

    const data: unknown[] = await this.parseCSV(file);
    for (const [i, rawData] of Object.entries(data)) {
      try {
        const rowData: CsvDataInterface = await this.prepareRow(rawData);

        validRows.push(await this.validateRow(rowData));

        logger(i, 'Valid');
      } catch (error) {
        logger(i, error);
        console.error(`Import failed #${i}`, error, rawData);
      }
    }

    return validRows;
  }

  async importCSV(rows: ImportRowDataInterface[], logger: LoggerFn) {
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
