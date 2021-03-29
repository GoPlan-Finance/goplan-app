import {BaseObject} from './base/BaseObject'


export class AssetSymbol extends BaseObject {

  static className = 'AssetSymbol'

  constructor () {
    super(AssetSymbol.className)
  }

}

AssetSymbol.register()
