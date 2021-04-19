/**
 *
 *
 */

const enc = new TextEncoder()
const dec = new TextDecoder()


export interface EncryptedValue {
  ct : string,
  iv : string,
  kVer : number,
  aVer : number,


  [index : string] : string | number,
}


export interface EncryptedKey extends EncryptedValue {
  s : string,
}


export interface DecryptedKey {
  salt : string,
  encryptionKey : string,
}


export interface DerivedKey {
  PBKDF2 : JsonWebKey,
}


export class Crypto {


  static isEncrypted (value : { [key:string] : unknown }, strict  = true) : boolean {

    if (typeof value !== 'object' || value === undefined || value === null) {
      return false
    }

    const keys = {
      ct   : 'string',
      iv   : 'string',
      kVer : 'number',
      aVer : 'number',
    }

    // All required keys are OK
    for (const [
      k, t
    ] of Object.entries(keys)) {

      if (typeof value[k] !== t) {
        return false
      }
    }

    if (!strict) {
      return true
    }

    const kk     = Object.keys(keys)
    const extras = Object.keys(value).filter(k => !kk.includes(k))

    return extras.length === 0
  }


  static buffToStr (buff : Uint8Array) : string {
    return btoa(String.fromCharCode.apply(null, buff))
  }

  static strToBuff (b64 : string) : Uint8Array {
    return Uint8Array.from(atob(b64), (c) => c.charCodeAt(null))
  }


  public static randomSalt () : Uint8Array {
    const size = 128
    return Crypto.randomWords(size / 8,
    )
  }

  static async encrypt (derivedKey : DerivedKey, data : unknown | string | number | null) : Promise<EncryptedValue> {

    try {
      const key = await Crypto.importKey(derivedKey.PBKDF2)


      const iv               = Crypto.randomIv()
      const encryptedContent = await window.crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv,
        },
        key,
        enc.encode(JSON.stringify(data !== undefined ? data : null)),
      )

      return {
        iv   : Crypto.buffToStr(iv),
        ct   : Crypto.buffToStr(new Uint8Array(encryptedContent)),
        kVer : 1,
        aVer : 2,
      }
    } catch (e) {
      console.error('Crypto::encrypt() Failed', e)
      throw e
    }


  }


  /*
   Import a PEM encoded RSA private key, to use for RSA-PSS signing.
   Takes a string containing the PEM encoded key, and returns a Promise
   that will resolve to a CryptoKey representing the private key.
   */
  private static async importKey (jwk : JsonWebKey) : Promise<CryptoKey> {
    return window.crypto.subtle.importKey(
      'jwk',
      jwk,
      {
        name: 'AES-GCM',
      },
      false,
      [
        'encrypt', 'decrypt'
      ],
    )
  }

  private static async exportKey (derivedKey : CryptoKey) : Promise<JsonWebKey> {
    return await window.crypto.subtle.exportKey(
      'jwk',
      derivedKey,
    )
  }

  static async PBKDF2 (masterKey : string, salt : Uint8Array) : Promise<DerivedKey> {

    const key = await window.crypto.subtle.importKey('raw', enc.encode(masterKey), 'PBKDF2', false, [
      'deriveKey',
    ])

    const derivedKey = await window.crypto.subtle.deriveKey(
      {
        name       : 'PBKDF2',
        salt,
        iterations : 250000,
        hash       : 'SHA-256',
      },
      key,
      {name: 'AES-GCM', length: 256},
      true,
      [
        'encrypt', 'decrypt'
      ],
    )


    return {
      PBKDF2: await Crypto.exportKey(derivedKey),
    }
  }

  static async decrypt<T> (derivedKey : DerivedKey, cypherObject : EncryptedValue) : Promise<T> {

    const key  = await Crypto.importKey(derivedKey.PBKDF2)
    const iv   = Crypto.strToBuff(cypherObject.iv)
    const data = Crypto.strToBuff(cypherObject.ct)

    try {
      const decryptedContent = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv,
        },
        key,
        data,
      )

      const decodedContent = dec.decode(decryptedContent)

      if (decodedContent === undefined || decodedContent === '') {
        return null
      }

      return JSON.parse(decodedContent)
    } catch (e) {
      console.error('Crypto::decrypt() Failed ', e)
      throw e
    }
  }

  static randomWords (len : number) : Uint8Array {
    return window.crypto.getRandomValues(new Uint8Array(len))
  }

  private static randomIv () {
    return Crypto.randomWords(12)
  }

}
