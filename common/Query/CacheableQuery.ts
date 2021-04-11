/**
 *
 *
 *
 */
import { BaseObject } from '/common/models/base/BaseObject'
import { Query } from '/common/Query'
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable prefer-rest-params */
import * as CryptoJS from 'crypto-js'

type CacheItemType<T> = { [key : string] : Promise<T> }
type HandlerFn<T> = () => Promise<T>


export class CacheableQuery<T extends BaseObject> extends Query<T> {

  private static CACHE : unknown = {}

  public  async findBy (
    params : { [key : string] : string | boolean | number | BaseObject | Parse.Pointer },
    useMasterKey = false,
  ) : Promise<T[]> {

    return this.handleCache<T[]>(this.className, arguments, () => {
      return super.findBy(params, useMasterKey)
    })
  }

  public  async findOneBy (
    params : { [key : string /* StringKeys<T>*/] : string | boolean | number | BaseObject | Parse.Pointer },
    useMasterKey = false,
  ) : Promise<T | undefined> {

    return this.handleCache<T>(this.className, arguments, () => {
      return super.findOneBy(params, useMasterKey)
    })
  }

  public  async findOrCreate (
    params : { [key : string] : string | boolean | number | BaseObject | Parse.Pointer },
    useMasterKey = false,
  ) : Promise<T> {

    return this.handleCache<T>(this.className, arguments, () => {
      return super.findOrCreate(params, useMasterKey)
    })
  }

  public  async getObjectById (
    docId : string,
    useMasterKey = false,
  ) : Promise<T> {

    return this.handleCache<T>(this.className, arguments, () => {
      return super.getObjectById(docId, useMasterKey)
    })
  }

  public  async getOrNull (
    docId : string,
    useMasterKey = false,
  ) : Promise<T> {

    return this.handleCache<T>(this.className, arguments, () => {
      return super.getOrNull(docId, useMasterKey)
    })

  }



  protected async handleCache<U> (className : string, params : unknown, fn : HandlerFn<U>) : Promise<U> {

    const CACHE = CacheableQuery.CACHE as CacheItemType<U>

    const hash = CryptoJS.MD5(className + JSON.stringify(params)).toString()

    if (CACHE[hash]) {
      return CACHE[hash] as Promise<U>
    }

    CACHE[hash] = fn()

    return CACHE[hash] as Promise<U>
  }

}
