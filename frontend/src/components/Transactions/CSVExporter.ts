/**
 *
 *
 *
 */
import { Transaction } from '@common/models';
import * as Papa from 'papaparse';
import { CsvDataInterface } from '@components/Transactions/CustomImporters/BaseCSVImporter';

export class CSVExporter {
  mapTransactions(transactions: Transaction[]): CsvDataInterface[] {
    return transactions.map(transaction => {
      return {
        currency: transaction.currency,
        date: transaction.executedAt?.toISOString(),
        price: transaction.price?.toString(),
        quantity: transaction.quantity?.toString(),
        fees: transaction.fees?.toString(),
        totalExcludingFees: transaction.totalExcludingFees?.toString(),
        type: transaction.type,
        accountName: transaction.account?.name,
        symbol: transaction.symbolName,
      };
    });
  }

  exportCSV(rows: CsvDataInterface[]): string {
    return Papa.unparse(rows);
  }

  downloadCSV(csv: string, filename?: string) {
    const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const tempLink = document.createElement('a');
    tempLink.href = window.URL.createObjectURL(csvData);
    tempLink.setAttribute('download', filename !== '' ? filename : 'transactions.csv');
    tempLink.click();
  }
}
