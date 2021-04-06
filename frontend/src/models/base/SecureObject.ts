import {Crypto, DerivedKey} from '../../../../common/Crypto'
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

      const derivedKey = Session.get('derivedKey') as DerivedKey

      return Crypto.decrypt<T>(derivedKey, val)
    }


    public set<T> (key: string | unknown, value: T | undefined = undefined, options = undefined): this | false {

      const encrypt = (k, v) => {
        if (v instanceof Parse.Object) {
          throw 'When setting Secure Fields, you cannot persists objects themselves, you need to use "myObject.toPointer()"'
        }
        const derivedKey = Session.get<DerivedKey>('derivedKey')

        if (!derivedKey) {
          throw 'Encryption key not set"'
        }

        const encryptedValue = Crypto.encrypt(derivedKey, v)

        return super.set(k, encryptedValue, options)
      }

      if (key && typeof key === 'object') {

        for (const k in key) {

          if (this.secureFields.includes(k)) {
            encrypt(k, key[k])
          } else {
            super.set(k as string, key[k], options)
          }
        }

        return this
      } else if (typeof key === 'string' && this.secureFields.includes(key)) {

        return encrypt(key, value)

      }

      return super.set(key as string, value, options)
    }

}


