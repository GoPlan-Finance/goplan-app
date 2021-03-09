// @todo move to common/models/user.ts

import {SecureObject} from './base/SecureObject'

class ExternalDataProvider extends SecureObject {

  constructor () {
    super('ExternalDataProvider', [
      'credentials'
    ])
  }

}

Parse.Object.registerSubclass('ExternalDataProvider', ExternalDataProvider)
asdf = 123

export {
  ExternalDataProvider
}
