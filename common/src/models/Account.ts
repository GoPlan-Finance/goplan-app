import { User } from '@common/models/User';
import { SecureObject } from '@utils/parse/SecureObject';

export class Account extends SecureObject {
  static className = 'Account';

  constructor() {
    super(Account.className, ['name']);
  }

  get name(): string {
    return this.get('name');
  }

  set name(value: string) {
    this.set('name', value);
  }

  get currency(): string {
    return this.get('currency');
  }

  set currency(value: string) {
    this.set('currency', value.toUpperCase());
  }

  get createdBy(): User {
    return this.get('createdBy');
  }

  set createdBy(value: User) {
    this.set('createdBy', value);
  }
}

Account.register();
