import { BaseObject } from '/common/models/base/BaseObject'

export class AssetAddressRegion extends BaseObject {

  static className = 'AssetAddressRegion'

  constructor () {
    super(AssetAddressRegion.className)
  }

  get state () : string {
    return this.get('state')
  }

  get country () : string {
    return this.get('country')
  }


}


AssetAddressRegion.register()
