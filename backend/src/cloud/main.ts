/**
 *
 *
 *
 */

import { MongoClient } from 'mongodb';
import { Connection } from './MongoDB/Connection';

import { SecureObject } from '@goplan-finance/utils';

async function ensureIndexes(client: MongoClient): Promise<void> {
  /// @todo Update when SchemaMigrations support unique indexes
  const db = client.db();

  await db
    .collection('AssetSymbol')
    .createIndex(
      { symbol: 1, _p_exchange: 1 },
      { name: 'assetsymbol_symbol_exchange', unique: true }
    );
}

export function cloudInit(databaseUrl: string) {
  SecureObject.setServerMode();

  Connection.open(databaseUrl).then(async (client: MongoClient) => {
    await ensureIndexes(client);

    require('./Auth');
    require('./User');

    require('./Watchlists');
    require('./WatchlistsItem');

    require('./Transaction');
    require('./Holding');

    require('./Account');
    require('./ExternalDataProvider');

    require('./Assets');
    require('./DataProviders');
  });
}
