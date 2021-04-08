import User from './User'

import AssetSymbol from './AssetSymbol'
import AssetSector from './AssetSector'
import AssetIndustry from './AssetIndustry'
import AssetProfile from './AssetProfile'
import AssetAddressRegion from './AssetAddressRegion'

import StockExchange from './StockExchange'

import Watchlist from './Watchlist'
import Transaction from './Transaction'

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
  Watchlist,
  Transaction,
]
