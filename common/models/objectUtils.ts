/**
 *
 *
 */

const USE_MASTER_KEY = {useMasterKey: true}

const getOrNull = async (type: string, docId: string, useMasterKey = false) => {

  const query = new Parse.Query(type)

  return await query.get(docId, useMasterKey ? USE_MASTER_KEY : undefined)
}

const get = async (type: string, docId: string, useMasterKey = false) => {
  const doc = await getOrNull(type, docId, useMasterKey)

  if (doc) {
    return doc
  }

  throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, `Document ${docId} not found`)
}

const findBy = async (type: string, params: { [key: string]: string | boolean | number | Parse.Object | Parse.Pointer }, useMasterKey = false) => {
  const query = new Parse.Query(type)

  for (const [
    k, v
  ] of Object.entries(params)) {
    query.equalTo(k, v)
  }

  return await query.find(useMasterKey ? USE_MASTER_KEY : undefined)
}

const findOneBy = async (type: string, params: { [key: string]: string | boolean | number | Parse.Object | Parse.Pointer }, useMasterKey = false) => {
  const query = new Parse.Query(type)

  for (const [
    k, v
  ] of Object.entries(params)) {
    query.equalTo(k, v)
  }

  return await query.first(useMasterKey ? USE_MASTER_KEY : undefined)
}


const createWithData = async (type: string, params: { [key: string]: string | boolean | number | Parse.Object | Parse.Pointer }, useMasterKey = false) => {

  const obj = new Parse.Object(type)
  obj.set(params)

  return await obj.save(null, useMasterKey ? USE_MASTER_KEY : undefined)
}

const findOrCreate = async (
  type: string,
  params: { [key: string]: string | boolean | number | Parse.Object | Parse.Pointer },
  useMasterKey = false) => {
  const obj = await findOneBy(type, params)

  if (obj) {
    return obj
  }

  return await createWithData(type, params, useMasterKey)
}


export {
  getOrNull,
  get,
  findBy,
  findOneBy,
  createWithData,
  findOrCreate,
}
