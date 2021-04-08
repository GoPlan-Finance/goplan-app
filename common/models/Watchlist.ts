import { AssetSymbol } from './AssetSymbol'
import { BaseObject } from './base/BaseObject'


export class Watchlist extends BaseObject {

  static className = 'Watchlist'

  constructor () {
    super(Watchlist.className)
  }

  get name () : string {
    return this.get('name')
  }

  get symbols () : AssetSymbol[] {
    return this.get('symbols')
  }

}


Watchlist.register()
