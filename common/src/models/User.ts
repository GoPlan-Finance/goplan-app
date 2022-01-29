Parse.User.allowCustomUserClass(true);

export interface UserProfileInfo {
  defaultCurrency: string;
  locale: string;
}

export class User extends Parse.User {
  get profileInfo(): UserProfileInfo {
    return this.get('profileInfo') || {};
  }
  set profileInfo(userProfileInfo: UserProfileInfo) {
    this.set('profileInfo', userProfileInfo);
  }
}

Parse.Object.registerSubclass('_User', User);
