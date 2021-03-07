/**
 *
 *
 *
 */


const assertEncrypted = (value) => {

    if (typeof value !== 'object') {
        throw `Invalid encrypted field value`
    }

    const {ct, iv, s} = value

    if (typeof s !== 'number') {
        throw '"salt" invalid'
    }
    if (typeof iv !== 'number') {
        throw '"iv" invalid'
    }
    if (typeof ct !== 'string') {
        throw '"cypherText" field invalid'
    }
}

const assertEncryptedField = (object, fieldName) => {

    const value = object.get(fieldName)
    assertEncrypted(value)
}

export {
    assertEncrypted,
    assertEncryptedField,
}
