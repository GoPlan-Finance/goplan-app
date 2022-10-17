import { Holding, Transaction } from '@models';
import { Query } from '@goplan-finance/utils';
import dayjs from 'dayjs';
import { useTransactionStore } from 'goplan-frontend/src/store';
import { HoldingTimeSeriesHelper } from 'goplan-frontend/src/store/Holding/HoldingTimeSeriesHelper';
// import { DataUpdateHelper } from '@models/Helpers/DataUpdateHelper';

export class HoldingHelperFrontend /*extends DataUpdateHelper<Holding>*/ {
  private static async updateHolding(holding: Holding) {
    if (!holding.pendingOps?.transactions) {
      return;
    }

    const transactionsStore = useTransactionStore();
    await transactionsStore.subscribe();

    console.log(`Updating holding "${holding.symbolName}"`);

    const allTransactions: Transaction[] = holding.pendingOps?.transactions.map(t => {
      const transaction: Transaction = Transaction.fromJSON(Transaction, t);
      return transaction;
    });

    await Promise.all(
      allTransactions.map(async (transaction): Promise<void> => {
        await transaction.decrypt(true);
      })
    );

    const transactions = allTransactions.filter(transaction => {
      if (
        (!transaction.symbol || !holding.symbol) &&
        transaction.symbol?.id !== holding.symbol?.id
      ) {
        // @todo prob not useful
        if (
          !transaction.symbolName ||
          !holding.symbolName ||
          transaction.symbolName !== holding.symbolName
        ) {
          return false;
        }
      }
      if (!transaction.type) {
        return false;
      }

      return ['buy', 'sell', 'split'].includes(transaction.type.toLowerCase());
    });

    holding.firstBuyAt = null;
    holding.lastBuyAt = null;

    holding.firstSellAt = null;
    holding.lastSellAt = null;

    holding.buyQty = 0;
    holding.buyAvgPrice = 0;
    holding.buyTotalPrice = 0;

    holding.openQty = 0;
    holding.openAvgPrice = 0;
    holding.openTotalPrice = 0;

    holding.closedQty = 0;
    holding.closedAvgPrice = 0;
    holding.closedTotalPrice = 0;

    const minMax = (holding: Holding, executedAt: Date, op: 'Buy' | 'Sell') => {
      const first: keyof Holding = `first${op}At`;
      const last: keyof Holding = `last${op}At`;

      if (!holding[first] || dayjs(holding[first]).unix() > dayjs(executedAt).unix()) {
        holding[first] = executedAt;
      }

      if (!holding[last] || dayjs(holding[last]).unix() < dayjs(executedAt).unix()) {
        holding[last] = executedAt;
      }
    };

    const avg = (holding: Holding, op: 'buy' | 'open' | 'closed') => {
      const total: keyof Holding = `${op}TotalPrice`;
      const qty: keyof Holding = `${op}Qty`;

      if (holding[qty] === 0) {
        return null;
      }

      return holding[total] / holding[qty];
    };

    transactions.forEach(transaction => {
      if (transaction.type.toLowerCase() === 'buy' || transaction.type.toLowerCase() === 'split') {
        holding.buyQty += transaction.quantity;
        holding.buyTotalPrice += transaction.totalExcludingFees;

        minMax(holding, transaction.executedAt, 'Buy');
      }

      if (transaction.type.toLowerCase() === 'sell') {
        holding.closedQty += transaction.quantity;
        holding.closedTotalPrice += transaction.totalExcludingFees;

        minMax(holding, transaction.executedAt, 'Sell');
      }
    });

    holding.openQty = holding.buyQty - holding.closedQty;
    holding.openTotalPrice = holding.buyTotalPrice - holding.closedTotalPrice;

    holding.buyAvgPrice = avg(holding, 'buy');
    holding.openAvgPrice = avg(holding, 'open');
    holding.closedAvgPrice = avg(holding, 'closed');

    console.log(
      `Updated "${holding.symbolName}" : BUY ${holding.buyQty}  , OPEN ${holding.openQty},  CLOSE ${holding.closedQty}`
    );
    holding.isOutdated = false;

    holding.pendingOps.transactions = undefined;

    await holding.save();

    await HoldingTimeSeriesHelper.updateHistory(holding, transactions);
  }

  public static async createMissingHoldings() {
    const missingQuery = async (): Promise<Transaction[]> => {
      // ( symbol || symbolName ) && ! holding
      return Query.and(
        Query.or(
          Query.create(Transaction).exists('symbol'),
          Query.create(Transaction).exists('symbolName')
        ),
        Query.create(Transaction).doesNotExist('holding')
      )
        .include('symbol')
        .findAll();
    };

    const transactions = await missingQuery();
    console.log(`Holdings->createMissingHoldings: Found ${transactions.length} to update`);
    for (const transaction of transactions) {
      const holding = await Holding.findOrCreateFromTransaction(transaction, false, true);

      if (!holding) {
        continue;
      }

      transaction.holding = holding;
      await transaction.save();
    }
  }

  public static async maybeUpdateOutdated(holding: Holding): Promise<void> {
    if (holding.isOutdated) {
      try {
        await HoldingHelperFrontend.updateHolding(holding);
      } catch (e) {
        console.error(`maybeUpdateOutdated(${holding.symbolName})`, e);
      }
    }
  }

  public static async findOutdatedHoldings() {
    const isOutdatedQuery = (): Query<Holding> => {
      const q = Query.whereQueries('or', [
        Query.create(Holding).notEqualTo('isOutdated', false),
        Query.create(Holding).doesNotExist('isOutdated'),
      ]);

      q.include('symbol');
      return q;
    };

    const holdings = await isOutdatedQuery().findAll();

    console.log(`Holdings->findOutdatedHoldings: Found ${holdings.length} to update`);
    for (const holding of holdings) {
      await HoldingHelperFrontend.maybeUpdateOutdated(holding);
    }
  }
}
