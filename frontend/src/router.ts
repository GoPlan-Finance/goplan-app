import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'

// import Login from "./views/Login.vue";
import Dashboard from './views/Dashboard.vue'
import Forms from './views/Forms.vue'
import Tables from './views/Tables.vue'
import Watchlists from './views/Watchlists.vue'
import WatchlistsDetails from './views/WatchlistsDetails.vue'
import UIElements from './views/UIElements.vue'
import Auth from './views/modules/Auth/Auth.vue'
import Modal from './views/Modal.vue'
import Card from './views/Card.vue'
import Test from './views/Test.vue'
import Charts from './views/Charts.vue'
import NotFound from './views/Error404.vue'
import Profile from './views/modules/Auth/Profile.vue'
import Details from './views/Details.vue'

const routes: RouteRecordRaw[] = [
  {
    path      : '/auth',
    name      : 'auth',
    component : Auth,
    meta      : {
      requiresAuth : false,
      layout       : 'empty',
    },
  },
  {
    path      : '/profile',
    name      : 'profile',
    component : Profile,
  },
  {
    path      : '/watchlists',
    name      : 'watchlists',
    component : Watchlists,
  },
  {
    path      : '/watchlists/:watchlistId',
    name      : 'watchlist',
    props     : true,
    component : WatchlistsDetails,
  },
  {
    path      : '/dashboard',
    name      : 'dashboard',
    component : Dashboard,
  },
  {
    path      : '/forms',
    name      : 'Forms',
    component : Forms,
  },
  {
    path      : '/cards',
    name      : 'Cards',
    component : Card,
  },
  {
    path      : '/tables',
    name      : 'Tables',
    component : Tables,
  },
  {
    path      : '/ui-elements',
    name      : 'UIElements',
    component : UIElements,
  },
  {
    path      : '/modal',
    name      : 'Modal',
    component : Modal,
  },
  {
    path      : '/test',
    name      : 'Test',
    component : Test,
  },
  {
    path      : '/charts',
    name      : 'Charts',
    component : Charts,
  },
  {
    path      : '/details/:ticker',
    name      : 'ticker_details',
    component : Details,
  },
  {
    path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound
  },

]
const router                   = createRouter({

  history: createWebHistory(),
  routes,
})


export default router
