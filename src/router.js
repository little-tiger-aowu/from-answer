import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import VueCookies from 'vue-cookies'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/state',
    name: 'state',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ './views/State.vue')
  },
  {
    path: '/form',
    name: 'form',
    component: () => import('./views/Form.vue')
  }
]

const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  let openId = VueCookies.get('openId')
  if (openId) {
    next()
  } else {
    if (to.path === '/') { // 这就是跳出循环的关键
      next()
    } else {
      next('/')
    }
  }
})
export default router
