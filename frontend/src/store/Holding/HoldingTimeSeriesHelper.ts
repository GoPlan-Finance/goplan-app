import { Holding, HoldingTimeSeries, Transaction } from '@common/models';
import { Query } from '@goplan-finance/utils';
import { CandleData } from '@components/Charts/CandleStickChart/CandlestickChart';
import { Mutex } from 'async-mutex';
import dayjs from 'dayjs';
import { SymbolDataResolution } from '@common/types/types';

const holdingMutex = new Mutex();

interface DateInfo {
  executedAt: dayjs.Dayjs;
  transaction: Transaction;
  openQty: number;
  avgPrice: number;
}

export class HoldingTimeSeriesHelper {
  private static dateGenerator(
    holding: Holding,
    transactions: Transaction[],
    period: SymbolDataResolution
  ): DateInfo[] {
    if (transactions.length === 0) {
      return [];
    }

    const start = HoldingTimeSeriesHelper.getStartOfPeriod(
      dayjs(transactions[0].executedAt),
      period
    );
    const end = HoldingTimeSeriesHelper.getEndOfPeriod(
      dayjs(transactions[transactions.length - 1].executedAt),
      period
    );
    const now = HoldingTimeSeriesHelper.getEndOfPeriod(dayjs(), period);

    if (start.isAfter(end)) {
      throw `start date "${start}" must be before the end date "${end}"`;
    }

    const deltas = [];
    for (const transaction of transactions) {
      if (!['buy', 'sell'].includes(transaction.type.toLowerCase())) {
        continue;
      }

      const op = transaction.type.toLowerCase() === 'sell' ? -1 : 1;
      const qty = transaction.quantity * op;
      const last = deltas.length ? deltas[deltas.length - 1].openQty : 0;

      deltas.push({
        executedAt: HoldingTimeSeriesHelper.getStartOfPeriod(dayjs(transaction.executedAt), period),
        transaction,
        openQty: last + qty,
        avgPrice: qty !== 0 ? transaction.totalExcludingFees / transaction.quantity : 0,
      });
    }

    const results = [];
    let current = deltas[0];
    for (let i = 1; i < deltas.length; ++i) {
      current = deltas[i - 1];
      const end = deltas[i];

      while (current.executedAt.isBefore(end.executedAt.endOf('day'))) {
        results.push({ ...current });

        current.executedAt = current.executedAt.add(1, period);
      }
    }

    if (!current || current.openQty === 0) {
      return results;
    }

    current = deltas[deltas.length - 1];
    while (current.executedAt.isBefore(now)) {
      results.push({ ...current });

      current.executedAt = current.executedAt.add(1, 'day');
    }

    return results;
  }

  public static getStartOfPeriod(date: dayjs.Dayjs, period: SymbolDataResolution): dayjs.Dayjs {
    if (['minute', 'hour', 'day', 'week', 'month', 'year'].includes(period)) {
      return dayjs(date).startOf(period.toString() as dayjs.OpUnitType);
    }

    throw `TimeSeries Period not supported`;
  }

  public static getEndOfPeriod(date: dayjs.Dayjs, period: SymbolDataResolution): dayjs.Dayjs {
    if (['minute', 'hour', 'day', 'week', 'month', 'year'].includes(period)) {
      return dayjs(date).endOf(period.toString() as dayjs.OpUnitType);
    }

    throw `TimeSeries Period not supported`;
  }

  private static getOrCreate(
    holding: Holding,
    existingPrices: HoldingTimeSeries[],
    start: dayjs.Dayjs,
    period: SymbolDataResolution
  ): HoldingTimeSeries {
    const existing = existingPrices.find(
      price => dayjs(price.startAt).format('YYYY-MM-DD') === dayjs(start).format('YYYY-MM-DD')
    );

    if (existing) {
      return existing;
    }

    const price = new HoldingTimeSeries();

    price.startAt = HoldingTimeSeriesHelper.getStartOfPeriod(start, period).toDate();
    price.period = period;

    price.holding = holding;
    price.currency = holding.currency;

    return price;
  }

  public static async updateHistory(holding: Holding, transactions: Transaction[]): Promise<void> {
    await Promise.all([
      await HoldingTimeSeriesHelper.updateHistoryPeriod(
        holding,
        transactions,
        SymbolDataResolution.DAY
      ),
      await HoldingTimeSeriesHelper.updateHistoryPeriod(
        holding,
        transactions,
        SymbolDataResolution.WEEK
      ),
      await HoldingTimeSeriesHelper.updateHistoryPeriod(
        holding,
        transactions,
        SymbolDataResolution.MONTH
      ),
    ]);
  }
  private static async updateHistoryPeriod(
    holding: Holding,
    transactions: Transaction[],
    period: SymbolDataResolution
  ): Promise<void> {
    transactions.sort((a, b) => a.executedAt.getTime() - b.executedAt.getTime());

    const dates = HoldingTimeSeriesHelper.dateGenerator(holding, transactions, period);

    if (dates.length === 0) {
      return;
    }

    const eodFormatted = await this.getEOD(dates, holding, period);

    if (!eodFormatted) {
      return;
    }

    const existingPrices = await Query.create(HoldingTimeSeries).findBy({
      period,
      holding,
    });

    const prices = [];
    let lastElem = null;
    for (const date of dates) {
      const dateKey = date.executedAt.format('YYYY-MM-DD');
      const openQty = date.openQty;

      const elem = eodFormatted[dateKey] ? eodFormatted[dateKey] : lastElem;
      lastElem = elem;
      const price = HoldingTimeSeriesHelper.getOrCreate(
        holding,
        existingPrices,
        date.executedAt,
        period
      );

      price.openQty = openQty;

      if (elem) {
        // @todo currency
        price.low = openQty * elem.low;
        price.high = openQty * elem.high;
        price.open = openQty * elem.open;
        price.close = openQty * elem.close;
      } else {
        price.low = openQty * date.avgPrice;
        price.high = openQty * date.avgPrice;
        price.open = openQty * date.avgPrice;
        price.close = openQty * date.avgPrice;
      }

      price.isOutdated = false;
      prices.push(price);
    }

    await HoldingTimeSeries.saveAll(prices);
  }

  private static async getEOD(
    dates: any[],
    holding: Holding,
    period: SymbolDataResolution
  ): Promise<{ [key: string]: CandleData }> {
    if (!holding.symbol) {
      return null;
    }

    const eodData: CandleData[] = await Parse.Cloud.run('Assets--GetEndOfDay', {
      resolution: period,
      from: dates[0].executedAt.toISOString(),
      to: dates[dates.length - 1].executedAt.toISOString(),
      assetSymbolId: holding.symbol.id,
    });

    const eodFormatted = {};
    for (const elem of eodData) {
      // EOD return the first market day for period, so if you ask for 2022-01-01, it will return 2022-01-03
      const startOfPeriod = HoldingTimeSeriesHelper.getStartOfPeriod(dayjs(elem.date), period);
      eodFormatted[startOfPeriod.format('YYYY-MM-DD')] = elem;
    }
    return eodFormatted;
  }
}
