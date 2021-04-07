import {StockExchange} from './StockExchange'
import {AssetSymbol} from './AssetSymbol'
import {AssetIndustry} from './AssetIndustry'
import {AssetSector} from './AssetSector'
import {AssetAddressRegion} from './AssetAddressRegion'
import {CacheableObject} from './base/CacheableObject'


export class AssetProfile extends CacheableObject {

    static className = 'AssetProfile'


    constructor () {
      super(AssetProfile.className)
    }


    get symbol (): AssetSymbol {
      return this.get('symbol')
    }

    get exchange (): StockExchange {
      return this.get('exchange')
    }

    get industry (): AssetIndustry {
      return this.get('industry')
    }

    get sector (): AssetSector {
      return this.get('sector')
    }

    get addressRegion (): AssetAddressRegion {
      return this.get('addressRegion')
    }

    get currency (): string {
      return this.get('currency')
    }

    get phone (): string {
      return this.get('phone')
    }

    get address (): string {
      return this.get('address')
    }

    get country (): string {
      return this.get('country')
    }

    get state (): string {
      return this.get('state')
    }

    get city (): string {
      return this.get('city')
    }

    get zip (): string {
      return this.get('zip')
    }

    get image (): string {
      return this.get('image')
    }

    get ipoDate (): Date {
      return this.get('ipoDate')
    }

    get website (): string {
      return this.get('website')
    }

    get fullTimeEmployees (): number {
      return this.get('fullTimeEmployees')
    }

    get description (): string {
      return this.get('description')
    }

    get ceo (): string {
      return this.get('ceo')
    }


}

AssetProfile.register()
