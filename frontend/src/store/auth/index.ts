import VueStore from 'vue-class-store'
import {User} from '../../models'

import CryptoJS from 'crypto-js'

class Auth {
    // properties are rebuilt as reactive data values
    public value: number

    // getters are converted to (cached) computed properties
    public get double(): number {
        return this.value * 2
    }

    public async signOut() {

        return Parse.User.logOut();
    }

    public async currentUser(): Promise<User | null> {

        return await Parse.User.currentAsync()
    }


    public async isAuthenticated(): Promise<boolean> {

        return !!await this.currentUser()
    }

    static encrypt(key, plainText) {

        var ivSize = 128;

        var salt = CryptoJS.lib.WordArray.random(ivSize / 8);
        var iv = CryptoJS.lib.WordArray.random(ivSize / 8);

        var derivateKey = Auth.PBKDF2(key, salt);

        var encrypted = CryptoJS.AES.encrypt(plainText, derivateKey, {
            iv: iv,
            padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC
        });

        return {
            iv: iv.toString(),
            s: salt.toString(),
            ct: encrypted.toString(),
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

    static decrypt(key, cypherObject) {

        var salt = CryptoJS.enc.Hex.parse(cypherObject.s);
        var iv = CryptoJS.enc.Hex.parse(cypherObject.iv)
        var encrypted = cypherObject.ct;

        var derivateKey = Auth.PBKDF2(key, salt);

        var decrypted = CryptoJS.AES.decrypt(
            encrypted,
            derivateKey, {
                iv: iv,
                padding: CryptoJS.pad.Pkcs7,
                mode: CryptoJS.mode.CBC
            })

        return decrypted.toString(CryptoJS.enc.Utf8);
    }

    public async isMasterKeyValid(masterKey): Promise<boolean> {
        try {
            await this.decryptClientKey(masterKey)
            return true
        } catch (err) {

        }

        return false
    }

    public async decryptClientKey(masterKey): Promise<object> {
        const user = await this.currentUser()

        if (!await this.hasClientKey()) {
            throw `No client key`
        }

        const clientKey = user.get('clientKey')

        const encryptionKey = Auth.decrypt(masterKey, clientKey)

        return JSON.parse(encryptionKey)
    }


    public async hasClientKey(): Promise<boolean> {
        const user = await this.currentUser()

        const clientKey = user.get('clientKey')
        if (clientKey) {

            // check if anything is missing
            return !['ct', 's', 'iv'].some(
                f => typeof clientKey[f] !== 'string' || clientKey[f].length === 0
            )
        }

        return false
    }

    public async createMasterKey(newMasterKey) {
        const user = await this.currentUser()

        const currentClientKey = user.get('clientKey') || null

        if (await this.hasClientKey()) {
            throw `Master Key already exists`
        }

        //
        // In a very simple case, all the user's data would be encrypted with the MasterKey, but
        // since the user may want to change its MasterKey at some point, we really dont want to have to decrypt/encrypt
        // the entire database with his new MasterKey. Therefore, instead we generate a random EncryptionKey and use
        // the user's MasterKey to secure the EncryptionKey.
        //

        // 2. We generate our super secret key that we will use to actually encrypt the user's data
        var encryptionKey = CryptoJS.lib.WordArray.random(128 / 8).toString();

        return Auth.encrypt(newMasterKey, JSON.stringify({
            encryptionKey
        }))
    }


    public async updateMasterKey(oldMasterKey, newMasterKey) {


    }

    // constructor parameters serve as props
    constructor(value: number = 1) {
        // constructor function serves as the created hook
        this.value = value
    }

    // prefix properties with `on:` to convert to watches
    'on:value'() {
        console.log('value changed to:', this.value)
    }

    // class methods are added as methods
    log() {
        console.log('value is:', this.value)
    }
}


@VueStore
export class AuthStore extends Auth {


}
