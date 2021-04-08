import { Crypto, DerivedKey } from '../..//Crypto'
import { BaseObject } from './BaseObject'


export abstract class SecureObject extends BaseObject {

  private static isServer         = false
  private static sessionDerivedKey : DerivedKey
  private secureFields : string[] = []

  public static  setServerMode () {
    SecureObject.isServer = true
  }

  protected constructor (className : string, secureFields : string[]) {
    super(className)

    this.secureFields = secureFields
  }

  static setSessionDerivedKey (derived : DerivedKey) : void {
    SecureObject.sessionDerivedKey = derived
  }

  public get<T> (attr : string) : T {

    const val = super.get(attr)

    if (SecureObject.isServer) {
      return val
    }

    if (!this.secureFields.includes(attr)) {
      return val
    }

    if (!SecureObject.sessionDerivedKey) {
      throw 'Encryption key not set"'
    }

    if (!val) {
      return val
    }

    return Crypto.decrypt<T>(SecureObject.sessionDerivedKey, val)
  }

  public set<T> (
    key : string | { [key : string] : unknown },
    value : T | undefined = undefined,
    options : unknown     = undefined,
  ) : this | false {
    if (SecureObject.isServer) {
      return super.set(key as string, value, options)
    }


    const encrypt = (k : string, v : unknown) => {
      if (v instanceof Parse.Object) {
        throw 'When setting Secure Fields, you cannot persists objects themselves, you need to use "myObject.toPointer()"'
      }

      if (!SecureObject.sessionDerivedKey) {
        throw 'Encryption key not set"'
      }

      const encryptedValue = Crypto.encrypt(SecureObject.sessionDerivedKey, v)

      return super.set(k, encryptedValue, options)
    }

    if (key && typeof key === 'object') {

      for (const k in key) {

        if (!Object.prototype.hasOwnProperty.call(key, k)) {
          continue
        }
        const v = key[k]

        if (this.secureFields.includes(k)) {
          encrypt(k, v)
        } else {
          super.set(k as string, v, options)
        }
      }

      return this
    } else if (typeof key === 'string' && this.secureFields.includes(key)) {

      return encrypt(key, value)

    }

    return super.set(key as string, value, options)
  }

}


