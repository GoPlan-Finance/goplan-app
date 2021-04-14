import { BaseObject } from '/@common/models/base/BaseObject'


export class AssetIndustry extends BaseObject {

  static className = 'AssetIndustry'


  constructor () {
    super(AssetIndustry.className)
  }


  get name () : string {
    return this.get('name')
  }


}


AssetIndustry.register()
