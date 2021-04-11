import { User } from '/common/models'
import { defineStore } from 'pinia'
import { AuthStore, Session } from '../auth'


export const useUserStore = defineStore({
  // name of the store
  // it is used in devtools and allows restoring state
  id : 'user',
  // a function that returns a fresh state
  state : () => {
    // const user = await AuthStore.currentUser() as User
    // const privateMode = user.profileInfo.privateMode || false

    const isPrivate = Session.get<boolean>('privateMode')

    console.log(isPrivate)
    return {
      privateMode : isPrivate,
    }
  },
  // optional getters
  getters : {

  },

  actions : {
    async setPrivateMode (enabled : boolean) {

      this.privateMode = enabled
      Session.set('privateMode' , enabled)
      console.log(this.privateMode ,Session.get<boolean>('privateMode') )
      // const user = await AuthStore.currentUser()
      //
      // this.privateMode = enabled
      // user.set('profileInfo', {
      //   privateMode : enabled,
      // })
      //
      // await user.save()
    },
  },
})
