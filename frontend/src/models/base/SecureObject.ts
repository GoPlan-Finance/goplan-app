import {Crypto} from '../../../../common/Crypto'
import {Session} from '../../store/auth'
import {BaseObject} from '../../../../common/models/base/BaseObject'

export abstract class SecureObject extends BaseObject {

    private secureFields: string[] = []

    protected constructor (className: string, secureFields: string[]) {
      super(className)

      this.secureFields = secureFields
    }

    public get<T> (attr: string): T {
      const val = super.get(attr)

      if (!this.secureFields.includes(attr)) {
        return val
      }

      const encryptionKey = Session.get('encryptionKey') as string

      return Crypto.decrypt<T>(encryptionKey, val)
    }


    public set<T> (key: string | unknown, value: T | undefined, options = undefined): this | false {

      if (key && typeof key === 'object') {

        for (const k in key) {
          // Avoid  set({a : 1 , b:2 , c:3}) when one field need to be encrypted
          if (this.secureFields.includes(k)) {
            throw `When setting Secure Fields, you need to perform a separate "set('${k}', value )"`
          }
        }
      } else if (typeof key === 'string' && this.secureFields.includes(key)) {

        if (value instanceof Parse.Object) {
          throw 'When setting Secure Fields, you cannot persists objects themselves, you need to use "myObject.toPointer()"'
        }
        const encryptionKey = Session.get<string>('encryptionKey')

        if (!encryptionKey) {
          throw 'Encryption key not set"'
        }

        const encryptedValue = Crypto.encrypt(encryptionKey, value)

        return super.set(key, encryptedValue, options)

      }

      return super.set(key as string, value, options)
    }

}


