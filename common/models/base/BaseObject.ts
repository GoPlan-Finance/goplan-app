/**
 *
 *
 *
 */

type LiveQueryUpdateFn<T> = (obj: T) => void

const USE_MASTER_KEY = {useMasterKey: true}

export /*abstract*/ class BaseObject extends Parse.Object {

  constructor (className: string) {
    super(className)
  }

  get createdAt (): Date {
    return this.get('createdAt')
  }

  get updatedAt (): Date {
    return this.get('updatedAt')
  }

  public static register () {
    // @ts-ignore
    Parse.Object.registerSubclass(this.className, this)
  }


  /**
     * Run a query on a collection
     * @param q The query
     * @param objects The array where objects will be added
     * @param updateFn A function that take a single object, that can be used to manipulate the object before it is added
     *                 to the array
     */
  public static async liveQuery<T extends BaseObject> (
    q: Parse.Query<T>,
    objects: T[] | null,
    updateFn?: LiveQueryUpdateFn<T>
  ): Promise<Parse.LiveQuerySubscription> {

    const replace = async (object: T) => {

      if (updateFn) {
        await updateFn(object)
      }

      if (objects !== null) {
        const index = objects.findIndex(o => o.id === object.id)


        if (index !== -1) {
          objects[index] = object
          return
        }
        objects.push(object)
      }
    }

    const remove = (object: BaseObject) => {

      if (objects !== null) {
        const index = objects.findIndex(o => o.id === object.id)

        if (index !== -1) {
          objects.splice(index, 1)
        }
      }
    }

    for (const object of await q.find()) {
      replace(object)
    }

    const subscription = await q.subscribe()

    subscription.on('create', item => {

      replace(item as T)
    })

    subscription.on('update', item => {

      replace(item as T)
    })

    subscription.on('delete', item => {
      remove(item as BaseObject)
    })

    return subscription
  }


  public static async getOrNull<T extends BaseObject> (
    docId: string,
    useMasterKey = false
  ): Promise<T> {

    const query = new Parse.Query<T>(this)

    return query.get(docId, useMasterKey ? USE_MASTER_KEY : undefined)
  }

  public static async getObjectById<T extends BaseObject> (
    docId: string,
    useMasterKey = false
  ): Promise<T> {
    const doc = await this.getOrNull<T>(docId, useMasterKey)

    if (doc) {
      return doc
    }

    throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, `Document ${docId} not found`)
  }

  public static async findBy <T extends BaseObject>(
    params: { [key: string]: string | boolean | number | BaseObject | Parse.Pointer },
    useMasterKey = false
  ): Promise<BaseObject[]> {

    const query = new Parse.Query<T>(this)

    for (const [
      k, v
    ] of Object.entries(params)) {
      // @ts-ignore
      query.equalTo(k, v)
    }

    return query.find(useMasterKey ? USE_MASTER_KEY : undefined)
  }

  public static async findOneBy (
    params: { [key: string]: string | boolean | number | BaseObject | Parse.Pointer },
    useMasterKey = false
  ): Promise<BaseObject | undefined> {

    const query = new Parse.Query(this)

    for (const [
      k, v
    ] of Object.entries(params)) {
      query.equalTo(k, v)
    }

    return query.first(useMasterKey ? USE_MASTER_KEY : undefined)
  }


  public static async findOrCreate (
    params: { [key: string]: string | boolean | number | BaseObject | Parse.Pointer },
    useMasterKey = false): Promise<BaseObject> {

    const obj = await this.findOneBy(params, useMasterKey)

    if (obj) {
      return obj
    }

    // debugger
    //         const ctor = this.constructor as typeof BaseObject;
    //         console.log(ctor.className); // true
    // @ts-ignore
    const obj2 = new this(this.className) // the `this` in `this.className` refer to the static child class

    obj2.set(params)

    return obj2.save(null, useMasterKey ? USE_MASTER_KEY : undefined)
  }

  public async maybeFetchPointer<T extends BaseObject> (
    param: Parse.Pointer|BaseObject,
  ): Promise<T> {
    // @ts-ignore
    return this.fetch(param.objectId)
  }

}
