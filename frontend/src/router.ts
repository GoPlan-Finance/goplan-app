import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";

import Dashboard from "./views/Dashboard.vue";
import Forms from "./views/Forms.vue";
import Tables from "./views/Tables.vue";
import UIElements from "./views/UIElements.vue";
// import Login from "./views/Login.vue";
import Auth from './views/modules/Auth/Auth.vue';
import Onboarding from './views/modules/Auth/Onboarding.vue';
import Modal from "./views/Modal.vue";
import Card from "./views/Card.vue";
import Blank from "./views/Test.vue";
import NotFound from "./views/Error404.vue";
import Test from "./views/Test.vue";

const routes: RouteRecordRaw[] = [
    {
        path: "/auth",
        name: "auth",
        component: Auth,
        meta: {
            requiresAuth: false,
            layout: "empty",
        },
    },
    {
        path: "/auth/createAccount",
        name: "create-account",
        component: Onboarding,
        meta: {
            layout: "empty"
        },
    },
    {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/forms",
    name: "Forms",
    component: Forms,
  },
  {
    path: "/cards",
    name: "Cards",
    component: Card,
  },
  {
    path: "/tables",
    name: "Tables",
    component: Tables,
  },
  {
    path: "/ui-elements",
    name: "UIElements",
    component: UIElements,
  },
  {
    path: "/modal",
    name: "Modal",
    component: Modal,
  },
  {
    path: "/test",
    name: "Test",
    component: Test,
  },
    {
        path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound
    },

];
const router = createRouter({

    history: createWebHistory(),
    routes: routes,
});


export default router;
