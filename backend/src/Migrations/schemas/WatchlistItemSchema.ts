import { SchemaMigrations } from 'parse-server'


export default SchemaMigrations.makeSchema('WatchlistItem', {
  fields: {
    createdBy : {type: 'Pointer', targetClass: '_User'},
    symbol    : {type: 'Pointer', targetClass: 'AssetSymbol', required: true},
    watchlist : {type: 'Pointer', targetClass: 'Watchlist', required: true},
  },
  indexes: {
    watchlist : {watchlist: 1},
    symbol    : {symbol: 1},
  },
  classLevelPermissions: {
    ...SchemaMigrations.CLPHelper.requiresAuthentication([
      'find', 'get', 'update', 'create', 'delete', 'count',
    ]),
  },
})
