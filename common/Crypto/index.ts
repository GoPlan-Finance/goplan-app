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

    static encrypt(key, data): EncryptedValue {

        var ivSize = 128;

        var salt = CryptoJS.lib.WordArray.random(ivSize / 8);
        var iv = CryptoJS.lib.WordArray.random(ivSize / 8);

        var derivateKey = Crypto.PBKDF2(key, salt);

        var encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), derivateKey, {
            iv: iv,
            padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC
        });

        return {
            iv: iv.toString(),
            s: salt.toString(),
            ct: encrypted.toString(),
            kVer: 1,
            aVer: 1,
        }
    }

    static PBKDF2(key, salt) {
        var keySize = 256;
        var iterations = 1000;

        return CryptoJS.PBKDF2(key, salt, {
            keySize: keySize / 32,
            iterations: iterations
        });
    }

    static decrypt(key, cypherObject: EncryptedValue) {

        var salt = CryptoJS.enc.Hex.parse(cypherObject.s);
        var iv = CryptoJS.enc.Hex.parse(cypherObject.iv)
        var encrypted = cypherObject.ct;

        var derivateKey = Crypto.PBKDF2(key, salt);

        var decrypted = CryptoJS.AES.decrypt(
            encrypted,
            derivateKey, {
                iv: iv,
                padding: CryptoJS.pad.Pkcs7,
                mode: CryptoJS.mode.CBC
            }).toString(CryptoJS.enc.Utf8)

        if (typeof decrypted !== 'string' || decrypted.length === 0) {
            throw `Decryption failed`
        }

        return (JSON.parse(decrypted))
    }


    static randomWords(len: number): string {
        return CryptoJS.lib.WordArray.random(len).toString();

    }
}
