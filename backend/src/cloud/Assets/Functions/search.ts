/**
 *
 *
 *
 */
// noinspection ES6PreferShortImport
import { AssetSymbol, StockExchange } from '@common/models';
import { CacheableQuery, ProcessUtils } from '@goplan-finance/utils';

import { assertUser } from '../../Auth';

import { DataProvider } from '../../DataProviders/providers';
import * as Types from '../../DataProviders/providers/types';

export async function AssetSymbolSearch(query: string): Promise<AssetSymbol[]> {
  const results = await DataProvider.searchSymbols(query);

  const assetSymbols: AssetSymbol[] = [];
  for (const [providerName, symbols] of Object.entries(results)) {
    const MAX_SYMBOLS = 15;

    await ProcessUtils.processBatch(
      symbols.slice(0, MAX_SYMBOLS),
      async (symbol: Types.AssetSymbol): Promise<void> => {
        const exchange = await CacheableQuery.create(StockExchange).findOrCreate(
          {
            code: symbol.exchange,
            dataProviderName: providerName,
          },
          true,
          true,
          {}
        );

        assetSymbols.push(
          await CacheableQuery.create(AssetSymbol).findOrCreate(
            {
              symbol: symbol.symbol,
              exchange,
              dataProviderName: providerName,
            },
            true,
            true,
            {
              name: symbol.name,
              currency: symbol.currency,
              exchangeCode: exchange.code,
              ISIN: symbol.ISIN,
              type: symbol.type,
            }
          )
        );
      },
      null
    );
  }

  return assetSymbols;
}

Parse.Cloud.define('Assets--Search', async request => {
  assertUser(request);
  const { query } = request.params;

  return await AssetSymbolSearch(query);
});
