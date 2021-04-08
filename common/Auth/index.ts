/**
 *
 *
 *
 */
import { EncryptedValue } from '../Crypto'


const assertEncrypted = (value : EncryptedValue) : void => {

  if (typeof value !== 'object') {
    throw 'Invalid encrypted field value'
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
      throw `Invalid type for "${k}"`
    }
  }

  const kk     = Object.keys(keys)
  const extras = Object.keys(value).filter(k => !kk.includes(k))

  if (extras.length) {
    throw `Extra parameters "${extras.join(',')}" are not allowed`
  }

}

const assertEncryptedField = (object : Parse.Object, fieldName : string) : void => {

  const value = object.get(fieldName)
  assertEncrypted(value)
}

const assertEncryptedFields = (object : Parse.Object, fieldNames : string[]) : void => {

  for (const fieldName in fieldNames) {
    assertEncryptedField(object, fieldName)
  }
}


export {
  assertEncrypted,
  assertEncryptedField,
  assertEncryptedFields,
}
