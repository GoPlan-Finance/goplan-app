import * as dayjs from 'dayjs'

import * as duration from 'dayjs/plugin/duration'
import * as relativeTime from 'dayjs/plugin/relativeTime'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import VueGapi from 'vue-gapi'
import App from './App.vue'
import './assets/main.css'
import Private from './components/base/Private.vue'
import LinkComponent from './components/router/AppLink.vue'
import i18n from './i18n'
import DashboardLayout from './layouts/DashboardLayout.vue'
import EmptyLayout from './layouts/EmptyLayout.vue'

import './parseConfig'
import router from './router'
import { AuthStore } from './store'
import StyleguideLayout from './styleguide/layouts/StyleguideLayout.vue'

import GoIcons from '/@components/Icons/GoIcons.vue'

dayjs.extend(duration)
dayjs.extend(relativeTime)


const app = createApp(App)

app.use(VueGapi, {
  clientId : '625813000498-2etprn7qf2ca8d3hpg0v1if77ihlp231.apps.googleusercontent.com',
  scope    : 'profile',
})
app.use(i18n)


const authStore = new AuthStore()

AuthStore.maybeLoadDerivedKey()


app.use(createPinia())
app.component('Private', Private)
app.component('DefaultLayout', DashboardLayout)
app.component('EmptyLayout', EmptyLayout)
app.component('StyleguideLayout', StyleguideLayout)
app.component('GoIcons', GoIcons)

app.provide('$authStore', authStore)

app.component('AppLink', LinkComponent)


// @todo move to router.ts
router.beforeEach(async (to, _, next) => {

  // const {authStore} = inject('$authStore')
  if (to.meta && to.meta.requiresAuth === false) {
    next()
    return
  }

  if (await authStore.isAuthenticated() !== true) {
    next({name: 'auth'})
    return
  }
  // const currentUser = await authStore.currentUser()
  // if (currentUser.isOnboardingCompleted() && to.name !== 'create-account') {
  //   next({name: 'profile'})
  //
  //   return
  // }

  next()
})


app.use(router)
app.mount('#app')
