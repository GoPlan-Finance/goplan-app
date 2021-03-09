// @todo move to common/models/user.ts

import {Crypto} from '../../../../common/Crypto'
import {Session} from '../../store/auth'

export class SecureObject extends Parse.Object {

    private secureFields = []
    private decryptedFields = {}

    constructor (className: string, secureFields: string[]) {
      super(className)

      this.secureFields = secureFields
    }

    public get<T> (attr:string): T {
      const val = super.get(attr)

      if (!this.secureFields.includes(attr)) {
        return val
      }

      if (this.decryptedFields[attr] !== undefined) {
        // @todo need more testing
        //return this.decryptedFields[attr]
      }

      this.decryptedFields[attr] = Crypto.decrypt(Session.get('encryptionKey'), val)

      return this.decryptedFields[attr]
    }


    public set (key: string | unknown, value = undefined, options = undefined) : this {

      if (key && typeof key === 'object') {

        for (const k in key) {
          // Avoid  set({a : 1 , b:2 , c:3}) when one field need to be encrypted
          if (this.secureFields.includes(k)) {
            throw `When setting Secure Fields, you need to perform a separate "set('${k}', value )"`
          }
        }
      } else if (typeof key === 'string') {

        value = Crypto.encrypt(Session.get('encryptionKey'), value)

      } else {
        throw 'Unexpected key type for set()'
      }

      return super.set(key, value, options)
    }

}


