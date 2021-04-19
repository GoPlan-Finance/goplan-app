import { Crypto, DerivedKey, EncryptedValue } from '../..//Crypto'
import { BaseObject } from './BaseObject'


const perf = {
  time : 0,
  ops  : 0,
}


export abstract class SecureObject extends BaseObject {

  private static isServer         = false
  private static sessionDerivedKey : DerivedKey
  private readonly secureFields : string[] = []

  public static setServerMode () :void {
    SecureObject.isServer = true
  }

  protected constructor (className : string, secureFields : string[]) {
    super(className)

    this.secureFields = secureFields
  }

  static setSessionDerivedKey (derived : DerivedKey) : void {
    SecureObject.sessionDerivedKey = derived
  }

  public _secureFields () : string[] {
    return this.secureFields
  }

  public async decrypt () : Promise<void> {
    if (SecureObject.isServer) {
      return
    }

    if (!SecureObject.sessionDerivedKey) {
      throw 'Encryption key not set"'
    }

    await Promise.all(
      this.secureFields.map(async fieldName => {
        const val = this.get(fieldName)

        if (val === undefined || val === null) {
          return // Skip null/undefined values. This will occur if we add new encrypted fields to the schema.
        }

        if (Crypto.isEncrypted(val)) {
          this.set(fieldName, await SecureObject.decryptField(val))
        }
      },
      ))
  }

  public async encrypt () : Promise<void> {

    if (SecureObject.isServer) {
      return
    }

    if (!SecureObject.sessionDerivedKey) {
      throw 'Encryption key not set"'
    }

    await Promise.all(
      this.secureFields.map(async fieldName => {
        const val = super.get(fieldName)

        if (!Crypto.isEncrypted(val)) {
          super.set(fieldName, await SecureObject.encryptField(val))
        }
      },
      ))
  }

  public static async decryptField<T> (val : EncryptedValue) : Promise<T> {

    const start = window.performance.now()

    const decrypted = await Crypto.decrypt<T>(SecureObject.sessionDerivedKey, val)

    perf.time += window.performance.now() - start
    //console.log(++perf.ops, perf.time)
    return decrypted
  }

  public static async encryptField<T> (val : T) : Promise<EncryptedValue> {

    if (Crypto.isEncrypted(val as unknown as EncryptedValue)) {

      throw 'Already encrypted'

      return val as unknown as EncryptedValue
    }


    if (val instanceof Parse.Object) {
      throw 'When setting Secure Fields, you cannot persists objects themselves, you need to use "myObject.toPointer()"'
    }

    return await Crypto.encrypt(SecureObject.sessionDerivedKey, val)
  }


  async save (
    target : SecureObject | Array<SecureObject | Parse.File> = undefined,
    options : Parse.RequestOptions                           = undefined,
  ) :Promise<this> {

    for (const [
      name, value
    ] of Object.entries(this.attributes)) {
      if (value instanceof BaseObject) {
        this.set(name, value.toPointer())
      }
    }

    await this.encrypt()
    const savedObject = await super.save(target, options)


    if (savedObject instanceof SecureObject) {
      await savedObject.decrypt()
    }

    return savedObject
  }

}


