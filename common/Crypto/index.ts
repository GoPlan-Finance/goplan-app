/**
 *
 *
 */
import * as CryptoJS from 'crypto-js'


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
  PBKDF2 : string,
}


export class Crypto {

  public static randomSalt () : string {
    const size = 128
    return CryptoJS.lib.WordArray.random(size / 8).toString()
  }

  static encrypt (derivedKey : DerivedKey, data : unknown | string | number | null) : EncryptedValue {
    const iv = Crypto.randomIv()

    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      CryptoJS.enc.Hex.parse(derivedKey.PBKDF2), {
        iv,
        padding : CryptoJS.pad.Pkcs7,
        mode    : CryptoJS.mode.CBC,
      })

    return {
      iv   : iv.toString(),
      ct   : encrypted.toString(),
      kVer : 1,
      aVer : 1,
    }
  }

  static PBKDF2 (key : string, salt : string) : DerivedKey {

    const keySize    = 256
    const iterations = 1000

    return {
      PBKDF2: CryptoJS.PBKDF2(key,
        CryptoJS.enc.Hex.parse(salt), {
          keySize: keySize / 32,
          iterations,
        }).toString(),
    }
  }

  static decrypt<T> (derivedKey : DerivedKey, cypherObject : EncryptedValue) : T {

    const key       = CryptoJS.enc.Hex.parse(derivedKey.PBKDF2)
    const iv        = CryptoJS.enc.Hex.parse(cypherObject.iv)
    const encrypted = cypherObject.ct

    const decrypted = CryptoJS.AES.decrypt(
      encrypted,
      key, {
        iv,
        padding : CryptoJS.pad.Pkcs7,
        mode    : CryptoJS.mode.CBC,
      }).toString(CryptoJS.enc.Utf8)

    if (typeof decrypted !== 'string' || decrypted.length === 0) {
      throw 'Decryption failed'
    }

    return (JSON.parse(decrypted))
  }

  static randomWords (len : number) : string {
    return CryptoJS.lib.WordArray.random(len).toString()

  }

  private static randomIv () {
    const size = 128
    return CryptoJS.lib.WordArray.random(size / 8)
  }

}
