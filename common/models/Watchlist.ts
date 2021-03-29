import {BaseObject} from './base/BaseObject'
import {User} from "./User";


export class Watchlist extends BaseObject {

    static className = 'Watchlist'

    constructor () {
      super(Watchlist.className)
    }

}

Watchlist.register()
