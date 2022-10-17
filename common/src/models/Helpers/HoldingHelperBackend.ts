import { Holding, Transaction } from '@models';
import { Query } from '@goplan-finance/utils';
// import { DataUpdateHelper } from '@models/Helpers/DataUpdateHelper';
import { HoldingPendingOpsInterface } from '@models/Holding';

export class HoldingHelperBackend /*extends DataUpdateHelper<Holding> */ {
  private static async _prepareData(holding: Holding): Promise<HoldingPendingOpsInterface> {
    const transactions = await Query.create(Transaction).useMasterKey(true).findBy({
      symbol: holding.symbol,
      createdBy: holding.createdBy,
    });

    return {
      transactions: transactions.map(t => t.toJSON()),
    };
  }

  public static async prepareData(holding: Holding): Promise<void> {
    holding.isOutdated = true;
    holding.pendingOps ??= {};
    holding.pendingOps = { ...(await HoldingHelperBackend._prepareData(holding)) };

    await holding.save(null, Holding.useMasterKey(true));
  }
}
