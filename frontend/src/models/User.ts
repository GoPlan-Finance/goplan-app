// @todo move to common/models/user.ts


Parse.User.allowCustomUserClass(true);

class User extends Parse.User {

    public _i = 1234

    public isOnboardingCompleted(): boolean {

        const {registrationCompleted} = this.get('status') || {}


        return registrationCompleted || false;
    }
}

Parse.Object.registerSubclass('_User', User);

export {
    User
}
