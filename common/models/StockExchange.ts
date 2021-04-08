import { CacheableObject } from './base/CacheableObject'


export class StockExchange extends CacheableObject {

  static className = 'StockExchange'

  constructor () {
    super(StockExchange.className)
  }

  get name () : string {
    return this.get('name')
  }

}


StockExchange.register()

