import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'

// import Login from "./views/Login.vue";
import Dashboard from './styleguide/views/Dashboard.vue'
import Forms from './styleguide/views/Forms.vue'
import Tables from './styleguide/views/Tables.vue'
import Watchlists from './views/Watchlists.vue'
import WatchlistsDetails from './views/WatchlistsDetails.vue'
import UIElements from './styleguide/views/UIElements.vue'
import Auth from './views/modules/Auth/Auth.vue'
import Modal from './components/Modal.vue'
import Card from './styleguide/views/Card.vue'
import Charts from './styleguide/views/Charts.vue'
import NotFound from './views/Error404.vue'
import Profile from './views/modules/Auth/Profile.vue'
import Details from './views/Details.vue'
import Buttons from './styleguide/views/Buttons.vue'
import StyleguideModals from './styleguide/views/Modals.vue'
import StyleguideDetail from './styleguide/views/StyleguideDetail.vue'
import Styleguide from './styleguide/views/Styleguide.vue'
import DataTables from './styleguide/views/DataTables.vue'

const appRoutes: RouteRecordRaw[] = [
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
    path      : '/',
    name      : 'home',
    component : Watchlists,
  },
  {
    path      : '/watchlists',
    name      : 'watchlists',
    component : Watchlists,
  },
  {
    path      : '/watchlists/:id',
    name      : 'watchlist',
    props     : true,
    component : WatchlistsDetails,
  },
  {
    path      : '/details/:ticker',
    name      : 'ticker_details',
    component : Details,
    props     : true,
  },
  {
    path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound
  },
]

const styleguideRoutes: RouteRecordRaw[] = [
  {
    path      : '/styleguide',
    name      : 'styleguide',
    component : Styleguide
  },
  {
    path      : '/styleguide/dashboard',
    name      : 'dashboard',
    component : Dashboard,
  },

  {
    path      : '/styleguide/modal',
    name      : 'Modal',
    component : Modal,
  },
  {
    path      : '/styleguide/charts',
    name      : 'Charts',
    component : Charts
  },
  {
    path      : '/styleguide/forms',
    name      : 'Forms',
    component : Forms,
  },
  {
    path      : '/styleguide/cards',
    name      : 'Cards',
    component : Card,
  },
  {
    path      : '/styleguide/tables',
    name      : 'Tables',
    component : Tables,
  },
  {
    path      : '/styleguide/ui-elements',
    name      : 'UIElements',
    component : UIElements,
  },
  {
    path      : '/styleguide/profile',
    name      : 'profile',
    component : Profile,
  },
  {
    path      : '/styleguide/buttons',
    name      : 'buttons',
    component : Buttons,
  },
  {
    path      : '/styleguide/data-tables',
    name      : 'data-tables',
    component : DataTables,
  },
  {
    path      : '/styleguide/details',
    name      : 'details',
    component : StyleguideDetail,
  },
  {
    path      : '/styleguide/modals',
    name      : 'modals',
    component : StyleguideModals,
  },
]

styleguideRoutes.forEach(route => (route.meta = {layout: 'styleguide'}))

const routes = appRoutes.concat(styleguideRoutes)

const router                   = createRouter({
  history: createWebHistory(),
  routes,
})


export default router
