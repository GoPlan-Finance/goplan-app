/**
 *
 *
 *
 */
import { BaseObject } from '/common/models/base/BaseObject'


export type LiveQueryUpdateFnEventType = null | 'updated' | 'created' | 'deleted'
export type LiveQueryUpdateFn<T> = (obj : T, event : LiveQueryUpdateFnEventType) => void
type Constructible<T> = (new (...args : any[]) => T)


export class Query<T extends BaseObject> extends Parse.Query<T> {

  objectClass : Constructible<T> = null

  constructor (objectClass : Constructible<T>) {
    super(objectClass)

    this.objectClass = objectClass
  }

  static create<U extends BaseObject> (objectClass : Constructible<U>) : Query<U> {
    return new Query<U>(objectClass)
  }


  /**
   * Run a query on a collection
   * @param objects The array where objects will be added
   * @param updateFn A function that take a single object, that can be used to manipulate the object before it is added
   *                 to the array
   * @param removeFn
   */
  public async liveQuery (
    objects : T[] | null,
    updateFn? : LiveQueryUpdateFn<T>,
    removeFn? : LiveQueryUpdateFn<T>,
  ) : Promise<Parse.LiveQuerySubscription> {

    const replace = async (object : T, event : LiveQueryUpdateFnEventType) => {

      if (updateFn) {
        await updateFn(object, event)
      }

      if (objects !== null) {
        const index = objects.findIndex(o => o.id === object.id)


        if (index !== -1) {
          objects[index] = object
          return
        }

        if (event) {
          objects.push(object)
        }
      }
    }

    const remove = async (object : T) => {

      if (removeFn) {
        await removeFn(object, 'deleted')
      }

      if (objects !== null) {
        const index = objects.findIndex(o => o.id === object.id)

        if (index !== -1) {
          objects.splice(index, 1)
        }
      }
    }

    const tmpObjects : T[] = []
    for (const object of await this.find()) {
      if (updateFn) {
        await updateFn(object, null)
      }
      tmpObjects.push(object)
    }
    if (objects) {
      objects.push(...tmpObjects)
    }


    const subscription = await this.subscribe()

    subscription.on('create', item => {

      replace(item as T, 'created')
    })

    subscription.on('update', item => {

      replace(item as T, 'updated')
    })

    subscription.on('delete', item => {
      remove(item as T)
    })

    return subscription
  }


  public async getOrNull (
    docId : string,
    useMasterKey = false,
  ) : Promise<T> {


    return this.get(docId, BaseObject.useMasterKey(useMasterKey))
  }

  public async getObjectById (
    docId : string,
    useMasterKey = false,
  ) : Promise<T> {
    const doc = await this.getOrNull(docId, useMasterKey)

    if (doc) {
      return doc
    }

    throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, `Document ${docId} not found`)
  }

  public async findBy (
    params : { [key : string] : string | boolean | number | BaseObject | Parse.Pointer },
    useMasterKey = false,
  ) : Promise<T[]> {

    for (const [
      k, v
    ] of Object.entries(params)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      query.equalTo(k, v)
    }

    return this.find(BaseObject.useMasterKey(useMasterKey))
  }

  public async findOneBy (
    params : { [key : string] : string | boolean | number | BaseObject | Parse.Pointer },
    useMasterKey = false,
  ) : Promise<T | undefined> {


    for (const [
      k, v
    ] of Object.entries(params)) {
      this.equalTo(k, v as any)
    }

    return this.first(BaseObject.useMasterKey(useMasterKey)) as Promise<T>
  }

  private createObject () : T {
    const className = this.className as any as new (...args : any[]) => T

    return new this.objectClass()
  }

  public async findOrCreate (
    params : { [key : string] : string | boolean | number | BaseObject | Parse.Pointer },
    useMasterKey = false,
    save         = true,
  ) : Promise<T> {

    const obj = await this.findOneBy(params, useMasterKey)

    if (obj) {
      return obj
    }

    const obj2 = this.createObject()

    obj2.set(params)

    if (!save) {
      return obj2
    }


    return obj2.save(null, BaseObject.useMasterKey(useMasterKey)) as Promise<T>
  }

}
