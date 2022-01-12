import { User } from '@common/models';
import { Crypto, CryptoUtils, SecureObject } from '@goplan-finance/utils';
import { Session } from './index';

export class AuthStore {
  public static maybeLoadDerivedKey(): void {
    const derivedKey = Session.get<CryptoUtils.DerivedKey>('derivedKey');
    SecureObject.setSessionDerivedKey(derivedKey);
  }

  public static clearDerivedKey(): void {
    AuthStore.storeDerivedKey(null);
  }

  private static storeDerivedKey(derivedKey: CryptoUtils.DerivedKey): void {
    // @todo ensure SessionStorage is safe storage for tokens
    Session.set('derivedKey', derivedKey);
    SecureObject.setSessionDerivedKey(derivedKey);
  }

  public async signOut(): Promise<Parse.User> {
    AuthStore.clearDerivedKey();
    return Parse.User.logOut();
  }

  public static async currentUser(): Promise<User | null> {
    return await Parse.User.currentAsync();
  }

  public async isAuthenticated(): Promise<boolean> {
    return !!(await AuthStore.currentUser());
  }

  public async isConnected(): Promise<boolean> {
    return !!Session.get('encryptionKey') && !!Session.get('encryptionSalt');
  }

  public async isMasterKeyValid(masterKey: string): Promise<boolean> {
    try {
      await this.decryptClientKey(masterKey);
      return true;
    } catch (err) {
      console.log('invalid master key');
    }

    return false;
  }

  public async decryptClientKey(masterKey: string): Promise<void> {
    const user = await AuthStore.currentUser();

    if (!user || !(await this.hasClientKey())) {
      throw 'No client key';
    }

    const clientKey = user.get('clientKey') as CryptoUtils.EncryptedKey;
    const derived = await Crypto.PBKDF2(masterKey, Crypto.strToBuff(clientKey.s));
    const key = (await Crypto.decrypt(derived, clientKey)) as CryptoUtils.DecryptedKey;

    if (!key || typeof key !== 'object') {
      throw 'Invalid key';
    }

    AuthStore.storeDerivedKey(derived);
  }

  public async hasClientKey(): Promise<boolean> {
    const user = await AuthStore.currentUser();

    if (!user) {
      throw false;
    }

    const clientKey = user.get('clientKey');
    if (clientKey) {
      // check if anything is missing
      return !['ct', 's', 'iv'].some(
        f => typeof clientKey[f] !== 'string' || clientKey[f].length === 0
      );
    }

    return false;
  }

  public async createMasterKey(newMasterKey: string): Promise<CryptoUtils.EncryptedKey> {
    if (await this.hasClientKey()) {
      throw 'Master Key already exists';
    }

    //
    // In a very simple case, all the user's data would be encrypted with the MasterKey, but
    // since the user may want to change its MasterKey at some point, we really dont want to have to decrypt/encrypt
    // the entire database with his new MasterKey. Therefore, instead we generate a random EncryptionKey and use
    // the user's MasterKey to secure the EncryptionKey.
    //

    // 2. We generate our super secret key that we will use to actually encrypt the user's data
    const encryptionKey = Crypto.randomWords(128);
    const salt = Crypto.randomSalt();

    const derived = await Crypto.PBKDF2(newMasterKey, salt);

    const encryptedKey = await Crypto.encrypt(derived, {
      encryptionKey: Crypto.buffToStr(encryptionKey),
    });

    return {
      ...encryptedKey /* contains ct, iv, kVer, aVer */,
      s: Crypto.buffToStr(salt),
    };
  }

  // public async updateMasterKey (oldMasterKey, newMasterKey) {
  //   throw 'tbd'
  // }
}
