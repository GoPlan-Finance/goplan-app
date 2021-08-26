import { User } from '@common/models/User';
import { BaseObject } from '@utils/parse/BaseObject';
import { AssetSymbol } from './AssetSymbol';

export class Watchlist extends BaseObject {
  static className = 'Watchlist';

  constructor() {
    super(Watchlist.className);
  }

  get name(): string {
    return this.get('name');
  }

  get symbols(): AssetSymbol[] {
    return this.get('symbols');
  }

  get createdBy(): User {
    return this.get('createdBy');
  }

  set createdBy(value: User) {
    this.set('createdBy', value);
  }
}

Watchlist.register();
