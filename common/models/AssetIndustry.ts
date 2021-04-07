import {CacheableObject} from './base/CacheableObject'


export class AssetIndustry extends CacheableObject {

  static className = 'AssetIndustry'


  constructor () {
    super(AssetIndustry.className)
  }


  get name (): string {
    return this.get('name')
  }


}

AssetIndustry.register()
