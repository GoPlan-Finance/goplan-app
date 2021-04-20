/**
 *
 *
 *
 */

/*abstract*/
export class BaseObject extends Parse.Object {

  constructor (className : string) {
    super(className)
  }

  public static  useMasterKey (use  = false) : { useMasterKey : boolean } | undefined {
    return use ?  {useMasterKey: true} : undefined
  }

  get createdAt () : Date {
    return this.get('createdAt')
  }

  get updatedAt () : Date {
    return this.get('updatedAt')
  }

  public static register () : void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore  error TS2339: Property 'className' does not exist on type 'typeof BaseObject'.
    Parse.Object.registerSubclass(this.className, this)
  }

  // public async maybeFetchPointer<T extends BaseObject> (
  //   params : string,
  //   useMasterKey = false,
  // ) : Promise<T> {
  //
  //   const value : T | Parse.Pointer = this.get(params)
  //
  //   if (value instanceof BaseObject) {
  //     return value as T
  //   }
  //
  //   return Query.create<T>(this).getObjectById(value.objectId, useMasterKey)
  // }

}
