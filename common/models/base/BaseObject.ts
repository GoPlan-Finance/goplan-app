/**
 *
 *
 *
 */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Query } from '/common/Query'


type LiveQueryUpdateFn<T> = (obj : T) => void

const USE_MASTER_KEY = {useMasterKey: true}


/*abstract*/
export class BaseObject extends Parse.Object {

  constructor (className : string) {
    super(className)
  }


  get createdAt () : Date {
    return this.get('createdAt')
  }

  get updatedAt () : Date {
    return this.get('updatedAt')
  }

  public static register () : void {
    // @ts-ignore  error TS2339: Property 'className' does not exist on type 'typeof BaseObject'.
    Parse.Object.registerSubclass(this.className, this)
  }

  public async maybeFetchPointer<T extends BaseObject> (
    params : string,
    useMasterKey = false,
  ) : Promise<T> {

    const value : T | Parse.Pointer = this.get(params)

    if (value instanceof BaseObject) {
      return value as T
    }

    return Query.create<T>(this.className).getObjectById(value.objectId, useMasterKey)
  }

}
