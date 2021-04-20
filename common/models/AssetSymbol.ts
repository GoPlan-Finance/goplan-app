import { BaseObject } from '/@common/models/base/BaseObject'
import { CacheableQuery } from '/@common/Query/CacheableQuery'
import { StockExchange } from './StockExchange'


export class AssetSymbol extends BaseObject {

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

  static async fetchSymbolByTicker (
    ticker : string,
    useMasterKey = false
  ) : Promise<AssetSymbol | null> {

    const query = CacheableQuery.create(AssetSymbol)
    query.equalTo('symbol', ticker.toUpperCase())
    query.include('exchange')

    return query.first(AssetSymbol.useMasterKey(useMasterKey))
  }


}


AssetSymbol.register()
