import { User } from '@common/models/User';
import { BaseObject, Query } from '@goplan-finance/utils';
import { AssetSymbol } from './AssetSymbol';
import { WatchlistItem } from '@models/WatchlistItem';

export class Watchlist extends BaseObject {
  static className = 'Watchlist';

  public percentChange: number;
  public symbolsCount: number;
  public symbols: AssetSymbol[];

  constructor() {
    super(Watchlist.className);
  }

  get name(): string {
    return this.get('name');
  }

  set name(value: string) {
    this.set('name', value);
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
