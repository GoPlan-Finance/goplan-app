import { BaseObject } from '/@common/models/base/BaseObject'

export class AssetSector extends BaseObject {

  static className = 'AssetSector'

  constructor () {
    super(AssetSector.className)
  }

  get name () : string {
    return this.get('name')
  }

}


AssetSector.register()
