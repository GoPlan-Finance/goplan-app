import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import DashboardLayout from './layouts/DashboardLayout.vue'
import EmptyLayout from './layouts/EmptyLayout.vue'

import VueGapi from 'vue-gapi'
import {AuthStore} from './store'

import './parseConfig'
import VueApexCharts from 'vue3-apexcharts'
import * as dayjs from 'dayjs'


import * as duration from 'dayjs/plugin/duration'
import i18n from './i18n'

dayjs.extend(duration)


const app = createApp(App)

app.use(VueGapi, {
  clientId : '625813000498-2etprn7qf2ca8d3hpg0v1if77ihlp231.apps.googleusercontent.com',
  scope    : 'profile',
})
app.use(i18n)
app.use(VueApexCharts)

const authStore = new AuthStore()

app.component('DefaultLayout', DashboardLayout)
app.component('EmptyLayout', EmptyLayout)
app.provide('$authStore', authStore)


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
