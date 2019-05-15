import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Layout from '@/views/layout/layout'
import hr from './routers/hr'
import hrfront from './routers/hrfront'
import system from './routers/system'
import salary from './routers/salary'
import financial from './routers/financial'
import setting from './routers/setting'
Vue.use(Router)
export default new Router({
  mode: 'history',
  routes: [
    {
      component: Layout,
      path: '/',
      meta: {
        requiresAuth: true,
        title: '面板'
      },
      children: [
        {
          path: '',
          name: 'home',
          component: Home,
          meta: {
            requiresAuth: true,
            title: '面板'
          }
        }
      ]
    },
    hr,
    hrfront,
    salary,
    financial,
    setting,
    {
      component: Layout,
      path: '/system',
      children: system
    },
    {
      component: () => import('@/views/account/login'),
      path: '/account/login'
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/404',
      component: () => import('@/views/prompt/404'),
      hidden: true
    },
    { path: '*', redirect: to => { return { path: '/404', query: { path: to.fullPath } } } }
  ]
})
