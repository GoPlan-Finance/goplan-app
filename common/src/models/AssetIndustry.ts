import { BaseObject } from '@goplan-finance/utils';

export class AssetIndustry extends BaseObject {
  static className = 'AssetIndustry';

  constructor() {
    super(AssetIndustry.className);
  }

  get name(): string {
    return this.get('name');
  }
}

AssetIndustry.register();
