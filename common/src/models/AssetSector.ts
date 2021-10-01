import { BaseObject } from '@goplan-finance/utils';

export class AssetSector extends BaseObject {
  static className = 'AssetSector';

  constructor() {
    super(AssetSector.className);
  }

  get name(): string {
    return this.get('name');
  }
}

AssetSector.register();
