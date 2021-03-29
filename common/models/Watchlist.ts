import {BaseObject} from './base/BaseObject'


export class Watchlist extends BaseObject {

    static className = 'Watchlist'

    constructor () {
      super(Watchlist.className)
    }

}

Watchlist.register()
