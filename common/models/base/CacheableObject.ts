/**
 *
 *
 *
 */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable prefer-rest-params */
import * as CryptoJS from 'crypto-js'
import { BaseObject } from './BaseObject'


type LiveQueryUpdateFn<T> = (obj : T) => void

const USE_MASTER_KEY = {useMasterKey: true}

type CacheItemType<T> = { [key : string] : Promise<T> }
type HandlerFn<T> = () => Promise<T>


/*abstract*/
export class CacheableObject extends BaseObject {

  private static CACHE : unknown = {}

  public static async findBy<T extends CacheableObject> (
    params : { [key : string] : string | boolean | number | CacheableObject | Parse.Pointer },
    useMasterKey = false,
  ) : Promise<CacheableObject[]> {

    // @ts-ignore
    return CacheableObject.handleCache<CacheableObject[]>(this.className, arguments, () => {
      return super.findBy(params, useMasterKey)
    })
  }

  public static async findOneBy<T extends CacheableObject> (
    params : { [key : string /* StringKeys<T>*/] : string | boolean | number | CacheableObject | Parse.Pointer },
    useMasterKey = false,
  ) : Promise<T | undefined> {

    // @ts-ignore
    return CacheableObject.handleCache<T>(this.className, arguments, () => {
      return super.findOneBy(params, useMasterKey)
    })
  }

  public static async findOrCreate<T extends CacheableObject> (
    params : { [key : string] : string | boolean | number | CacheableObject | Parse.Pointer },
    useMasterKey = false,
  ) : Promise<T> {

    // @ts-ignore
    return CacheableObject.handleCache<T>(this.className, arguments, () => {
      return super.findOrCreate<T>(params, useMasterKey)
    })
  }

  public static async getObjectById<T extends CacheableObject> (
    docId : string,
    useMasterKey = false,
  ) : Promise<T> {

    // @ts-ignore
    return CacheableObject.handleCache<T>(this.className, arguments, () => {
      return super.getObjectById<T>(docId, useMasterKey)
    })
  }

  public static async getOrNull<T extends CacheableObject> (
    docId : string,
    useMasterKey = false,
  ) : Promise<T> {

    // @ts-ignore
    return CacheableObject.handleCache<T>(this.className, arguments, () => {
      return super.getOrNull(docId, useMasterKey)
    })

  }

  public async maybeFetchPointer<T extends CacheableObject> (
    params : string,
    useMasterKey = false,
  ) : Promise<T> {

    // @ts-ignore
    return CacheableObject.handleCache<T>(this.className, arguments, () => {
      return super.maybeFetchPointer(params, useMasterKey)
    })
  }

  protected static async handleCache<T> (className : string, params : unknown, fn : HandlerFn<T>) : Promise<T> {

    const CACHE = CacheableObject.CACHE as CacheItemType<T>

    const hash = CryptoJS.MD5(className + JSON.stringify(params)).toString()

    if (CACHE[hash]) {
      return CACHE[hash] as Promise<T>
    }

    CACHE[hash] = fn()

    return CACHE[hash] as Promise<T>
  }

}
