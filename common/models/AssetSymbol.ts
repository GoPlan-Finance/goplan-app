import { CacheableObject } from './base/CacheableObject'
import { StockExchange } from './StockExchange'


export class AssetSymbol extends CacheableObject {

  static className = 'AssetSymbol'


  constructor () {
    super(AssetSymbol.className)
  }

  get symbol () : string {
    return this.get('symbol')
  }

  get name () : string {
    return this.get('name')
  }

  get dataProviderName () : string {
    return this.get('dataProviderName')
  }

  get exchange () : StockExchange {
    return this.get('exchange')
  }

  get currency () : string {
    return this.get('currency')
  }

  static async fetchSymbolByTicker (ticker : string) : Promise<AssetSymbol | null> {
    const query = new Parse.Query(AssetSymbol)
    query.equalTo('symbol', ticker.toUpperCase())
    query.include('exchange')
    return query.first()
  }

  async getExchange () : Promise<StockExchange> {
    return this.maybeFetchPointer('exchange')
  }

}


AssetSymbol.register()
