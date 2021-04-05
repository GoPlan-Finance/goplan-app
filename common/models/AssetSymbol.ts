import {BaseObject} from './base/BaseObject'
import {StockExchange} from './StockExchange'


export class AssetSymbol extends BaseObject {

  static className = 'AssetSymbol'

  constructor () {
    super(AssetSymbol.className)
  }

  static async fetchSymbolByTicker (ticker: string): Promise<AssetSymbol> {
    const query      = new Parse.Query(AssetSymbol)
    query.equalTo('symbol', ticker.toUpperCase())
    query.include('exchange')
    return query.first()
  }

  get symbol (): string {
    return this.get('symbol')
  }

  get name (): string {
    return this.get('name')
  }

  get dataProviderName (): string {
    return this.get('dataProviderName')
  }

  get exchange (): StockExchange {
    return this.get('exchange')
  }

  async getExchange (): Promise<StockExchange> {
    return this.maybeFetchPointer<StockExchange>(this.get('exchange'))
  }

}

AssetSymbol.register()
