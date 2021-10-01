/**
 *
 *
 *
 */

import { SecureObject } from '@goplan-finance/utils';
import { Crypto } from '../Crypto';

const assertEncryptedField = (object: Parse.Object, fieldName: string): void => {
  const value = object.get(fieldName);

  if (value !== undefined && !Crypto.isEncrypted(value)) {
    throw `Field "${fieldName}" is not encrypted as expected.`;
  }
};

const assertEncryptedObject = (object: SecureObject): void => {
  if (!(object instanceof SecureObject)) {
    throw 'assertEncrypted(): Object is not a SecureObject';
  }

  const fields = object._secureFields();
  for (const fieldName of fields) {
    assertEncryptedField(object, fieldName);
  }
};

export { assertEncryptedField, assertEncryptedObject };
