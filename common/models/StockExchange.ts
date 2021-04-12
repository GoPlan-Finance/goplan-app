import { BaseObject } from '/common/models/base/BaseObject'


export class StockExchange extends BaseObject {

  static className = 'StockExchange'

  constructor () {
    super(StockExchange.className)
  }

  get name () : string {
    return this.get('name')
  }

}


StockExchange.register()

