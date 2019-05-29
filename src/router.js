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
import adminManagement from './routers/adminManagement'
Vue.use(Router)





let asyncRoutes = [
  ...hr,
  ...system
]

let router =  new Router({
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
  
    hrfront,
    salary,
    financial,
    setting,
    adminManagement,
    // {
    //   component: Layout,
    //   path: '/system',
    //   children: system
    // },
    {
      component: () => import('@/views/account/login'),
      path: '/account/login'
    },
    {
      path: '/404',
      component: () => import('@/views/prompt/404'),
      hidden: true
    },
    // { path: '*', redirect: to => { return { path: '/404', query: { path: to.fullPath } } } }
  ]
})


const generateRoutes = (menu,base)=>{
  let res = []
  if(!base){
    for(let router of menu){
      let r = {
        component: Layout,
        path: router.url,
        children: []
      }
      if(router.subs && router.subs.length){
        r.children = generateRoutes(router.subs,router.url)
      }
      res.push(r)
    }
  }else{
    for(let router of menu){
      var c = asyncRoutes.find(o=>o.name===router.unieCode)
      if(!c){
        console.error('找不到路由'+router.name+''+router.unieCode)
      }
      let r = {
        meta:{},
       ...c,
       path:router.url?base+'/'+router.url:Math.random()+'',
      }
      r.meta.title = router.name
      if(router.subs && router.subs.length){
        r.children = generateRoutes(router.subs,base)
      }
      res.push(r)
    }
  }
  return res
}

export default router
export { router,generateRoutes }
