/**
 *
 *
 *
 */
type LiveQueryUpdateFn<T> = (obj: T) => void

export class BaseObject extends Parse.Object {

  constructor (className: string) {
    super(className)
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
  ): Parse.LiveQuerySubscription {

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

    const remove = (object: T) => {

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

    subscription.on('create', watchlist => {

      replace(watchlist)
    })

    subscription.on('update', watchlist => {

      replace(watchlist)
    })

    subscription.on('delete', watchlist => {
      remove(watchlist)
    })

    return subscription
  }


}
