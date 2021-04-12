Parse.User.allowCustomUserClass(true)

export interface UserProfileInfo{
  privateMode : boolean
}

export class User extends Parse.User {


  get profileInfo () : UserProfileInfo {
    return this.get('profileInfo') || {}
  }


}


Parse.Object.registerSubclass('_User', User)
