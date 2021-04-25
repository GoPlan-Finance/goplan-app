import { AssetSymbol, Watchlist } from '/@common/models'
import { User } from '/@common/models/User'
import { BaseObject } from './base/BaseObject'


export class WatchlistItem extends BaseObject {

  static className = 'WatchlistItem'

  constructor () {
    super(WatchlistItem.className)
  }

  get watchlist () : Watchlist {
    return this.get('watchlist')
  }

  set watchlist (value : Watchlist) {
    this.set('watchlist', value)
  }

  get symbol () : AssetSymbol {
    return this.get('symbol')
  }

  set symbol (value : AssetSymbol) {
    this.set('symbol', value)
  }

  get createdBy () : User {
    return this.get('createdBy')
  }

  set createdBy (value : User) {
    this.set('createdBy', value)
  }

}


WatchlistItem.register()
