Parse.User.allowCustomUserClass(true);

export class User extends Parse.User {
  get defaultCurrency(): string {
    return this.get('defaultCurrency');
  }

  set defaultCurrency(currency: string) {
    this.set('defaultCurrency', currency);
  }

  get locale(): string {
    return this.get('locale');
  }

  set locale(locale: string) {
    this.set('locale', locale);
  }
}

Parse.Object.registerSubclass('_User', User);
