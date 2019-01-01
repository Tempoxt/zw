import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Layout from '@/views/layout/layout'
import hr from './routers/hr'
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
    {
      component: Layout,
      path: '/system',
      children: [
        {
          path: 'menusheet',
          name: 'menusheet',
          meta: {
            title: '菜单管理'
          },
          component: () => import('@/views/system/menusheet')
        },
        {
          path: 'pagemanager',
          name: 'pagemanager',
          meta: {
            title: '页面管理'
          },
          component: () => import('@/views/system/pagemanager')
        },
        {
          path: 'actionsheet',
          name: 'actionsheet',
          meta: {
            title: '功能管理'
          },
          component: () => import('@/views/system/actionsheet')
        },
        {
          path: 'org',
          name: 'org',
          meta: {
            title: '组织架构'
          },
          component: () => import('@/views/system/org')
        },
        {
          path: 'user',
          name: 'user',
          meta: {
            title: '用户管理'
          },
          component: () => import('@/views/system/user')
        },
        {
          path: 'permission',
          name: 'permission',
          component: () => import('@/views/system/permission')
        },
        {
          path: 'roles',
          name: 'roles',
          meta: {
            title: '角色权限管理'
          },
          component: () => import('@/views/system/roles')
        }
      ]
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
