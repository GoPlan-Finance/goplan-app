import {BaseObject} from './base/BaseObject'
import {User} from './User'
import {AssetSymbol} from './AssetSymbol'


export class Watchlist extends BaseObject {

    static className = 'Watchlist'

    constructor () {
      super(Watchlist.className)
    }

    get name (): string {
      return this.get('name')
    }
    get createdBy (): User {
      return this.get('createdBy')
    }
    get symbols (): AssetSymbol[] {
      return this.get('symbols')
    }

}

Watchlist.register()
