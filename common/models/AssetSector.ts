import {CacheableObject} from './base/CacheableObject'


export class AssetSector extends CacheableObject {

  static className = 'AssetSector'

  constructor () {
    super(AssetSector.className)
  }

  get name (): string {
    return this.get('name')
  }

}

AssetSector.register()
