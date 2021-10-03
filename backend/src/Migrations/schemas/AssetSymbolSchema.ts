import { SchemaMigrations } from 'parse-server';

export default SchemaMigrations.makeSchema('AssetSymbol', {
  fields: {
    name: { type: 'String' },
    symbol: { type: 'String' },
    exchangeCode: { type: 'String' },
    dataProviderName: { type: 'String' },
    currency: { type: 'String' },
    ISIN: { type: 'String' },
    type: { type: 'String' },
    exchange: { type: 'Pointer', targetClass: 'StockExchange' },
  },
  indexes: {
    symbol: { symbol: 1 },
    exchangeCode: { exchangeCode: 1 },
    ISIN: { ISIN: 1 },
  },
  classLevelPermissions: {
    ...SchemaMigrations.CLP.allow({
      requiresAuthentication: ['find', 'get', 'count'],
    }),
  },
});
