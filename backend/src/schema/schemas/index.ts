import AssetPrice from './AssetPrice'
import Account from './Account'
import AssetAddressRegion from './AssetAddressRegion'
import AssetIndustry from './AssetIndustry'
import AssetProfile from './AssetProfile'
import AssetSector from './AssetSector'
import AssetSymbol from './AssetSymbol'
import StockExchange from './StockExchange'
import Transaction from './Transaction'
import User from './User'
import Watchlist from './Watchlist'
import WatchlistItem from './WatchlistItem'


export const schemas = [
  User,

  // no dependencies
  AssetSymbol,
  AssetSector,
  AssetIndustry,
  AssetAddressRegion,
  StockExchange,

  // has dependencies
  AssetProfile,
  AssetPrice,
  Account,
  Watchlist,
  WatchlistItem,
  Transaction,
]
