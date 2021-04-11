/**
 *
 *
 *
 */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { BaseObject } from '/common/models/base/BaseObject'


type LiveQueryUpdateFn<T> = (obj : T) => void

const USE_MASTER_KEY = {useMasterKey: true}


export class Query<T extends BaseObject> extends Parse.Query<T> {

  constructor (objectClass: string | (new (...args: any[]) => T | BaseObject)) {
    super(objectClass)
  }

  static create<U extends BaseObject> (objectClass: string | (new (...args: any[]) => U | BaseObject)) : Query<U> {
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

    const replace = async (object : T) => {

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

    const remove = async (object : T) => {

      if (removeFn) {
        await removeFn(object)
      }

      if (objects !== null) {
        const index = objects.findIndex(o => o.id === object.id)

        if (index !== -1) {
          objects.splice(index, 1)
        }
      }
    }

    for (const object of await this.find()) {
      replace(object)
    }

    const subscription = await this.subscribe()

    subscription.on('create', item => {

      replace(item as T)
    })

    subscription.on('update', item => {

      replace(item as T)
    })

    subscription.on('delete', item => {
      remove(item as T)
    })

    return subscription
  }


  public  async getOrNull (
    docId : string,
    useMasterKey = false,
  ) : Promise<T> {


    return this.get(docId, useMasterKey ? USE_MASTER_KEY : undefined)
  }

  public  async getObjectById (
    docId : string,
    useMasterKey = false,
  ) : Promise<T> {
    const doc = await this.getOrNull(docId, useMasterKey)

    if (doc) {
      return doc
    }

    throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, `Document ${docId} not found`)
  }

  public  async findBy (
    params : { [key : string] : string | boolean | number | BaseObject | Parse.Pointer },
    useMasterKey = false,
  ) : Promise<T[]> {

    for (const [
      k, v
    ] of Object.entries(params)) {
      // @ts-ignore
      query.equalTo(k, v)
    }

    return this.find(useMasterKey ? USE_MASTER_KEY : undefined)
  }

  public  async findOneBy (
    params : { [key : string] : string | boolean | number | BaseObject | Parse.Pointer },
    useMasterKey = false,
  ) : Promise<T | undefined> {


    for (const [
      k, v
    ] of Object.entries(params)) {
      this.equalTo(k, v as any)
    }

    return this.first(useMasterKey ? USE_MASTER_KEY : undefined) as Promise<T>
  }

  private createObject () : T {
    const className = this.className as any as new (...args: any[]) => T

    return new className()
  }

  public async findOrCreate (
    params : { [key : string] : string | boolean | number | BaseObject | Parse.Pointer },
    useMasterKey = false,
  ) : Promise<T> {

    const obj = await this.findOneBy(params, useMasterKey)

    if (obj) {
      return obj
    }

    const obj2      = this.createObject()

    obj2.set(params)

    return obj2.save(null, useMasterKey ? USE_MASTER_KEY : undefined) as Promise<T>
  }

}
