/**
 *
 *
 */
import CryptoJS from 'crypto-js'

export interface EncryptedValue {
    ct: string,
    iv: string,
    s: string,
    kVer: number,
    aVer: number,
}

export class Crypto {

  static encrypt (key :string, data :unknown|string|number|null): EncryptedValue {

    const ivSize = 128

    const salt = CryptoJS.lib.WordArray.random(ivSize / 8)
    const iv   = CryptoJS.lib.WordArray.random(ivSize / 8)

    const derivedKey = Crypto.PBKDF2(key, salt)

    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), derivedKey, {
      iv,
      padding : CryptoJS.pad.Pkcs7,
      mode    : CryptoJS.mode.CBC
    })

    return {
      iv   : iv.toString(),
      s    : salt.toString(),
      ct   : encrypted.toString(),
      kVer : 1,
      aVer : 1,
    }
  }

  static PBKDF2 (key:string, salt :unknown) : unknown {
    const keySize    = 256
    const iterations = 1000

    return CryptoJS.PBKDF2(key, salt, {
      keySize: keySize / 32,
      iterations
    })
  }

  static decrypt (key:string, cypherObject: EncryptedValue) : unknown {

    const salt      = CryptoJS.enc.Hex.parse(cypherObject.s)
    const iv        = CryptoJS.enc.Hex.parse(cypherObject.iv)
    const encrypted = cypherObject.ct

    const derivedKey = Crypto.PBKDF2(key, salt)

    const decrypted = CryptoJS.AES.decrypt(
      encrypted,
      derivedKey, {
        iv,
        padding : CryptoJS.pad.Pkcs7,
        mode    : CryptoJS.mode.CBC
      }).toString(CryptoJS.enc.Utf8)

    if (typeof decrypted !== 'string' || decrypted.length === 0) {
      throw 'Decryption failed'
    }

    return (JSON.parse(decrypted))
  }


  static randomWords (len: number): string {
    return CryptoJS.lib.WordArray.random(len).toString()

  }

}
