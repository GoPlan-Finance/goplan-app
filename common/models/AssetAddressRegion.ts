import {CacheableObject} from './base/CacheableObject'


export class AssetAddressRegion extends CacheableObject {

    static className = 'AssetAddressRegion'

    constructor () {
      super(AssetAddressRegion.className)
    }

    get state (): string {
      return this.get('state')
    }

    get country (): string {
      return this.get('country')
    }


}

AssetAddressRegion.register()
