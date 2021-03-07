// @todo move to common/models/user.ts

class ExternalDataProvider extends Parse.Object {

    constructor() {
        super('ExternalDataProvider');
    }


}

Parse.Object.registerSubclass('ExternalDataProvider', ExternalDataProvider);

export {
    ExternalDataProvider
}
