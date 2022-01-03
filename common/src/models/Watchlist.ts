import { User } from '@common/models/User';
import { BaseObject } from '@goplan-finance/utils';
import { AssetSymbol } from './AssetSymbol';

export class Watchlist extends BaseObject {
  static className = 'Watchlist';

  public percentChange: number;
  public symbolsCount: number;

  constructor() {
    super(Watchlist.className);
  }

  get id(): string {
    return this.get('id');
  }

  get name(): string {
    return this.get('name');
  }

  get createdBy(): User {
    return this.get('createdBy');
  }

  set createdBy(value: User) {
    this.set('createdBy', value);
  }

  get updatedAt(): Date {
    return this.get('updatedAt');
  }
}

Watchlist.register();
