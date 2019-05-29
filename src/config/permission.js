import { router,generateRoutes } from '../router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import auth from '@/utils/auth'
import store from '@/store'
let routerHash = {}
const createdRouterHash = (router) => {

}
router.beforeEach(async (to, from, next) => {
    
    NProgress.start()
    if (!auth.getToken() && to.path !== '/account/login') {
        next({
            path: '/account/login',
            query: { redirect: to.fullPath }
        })
        return
    }
    if (auth.getToken()) {
        if (to.path === '/account/login') {
            next({
                path: '/'
            })
            return
        }
        if (store.state.user.userInfo === null) {
           await store.dispatch('user/getUserInfo')
        }
        if (store.state.app.menuList === null) {
            const { menu } = await store.dispatch('getMenuList')
            console.log(menu)
            console.log(generateRoutes(menu),'generateRoutes')
            let menus = generateRoutes(menu)
            router.addRoutes([menus[0]])
            router.addRoutes([menus[1]])
            router.addRoutes([{ path: '*', redirect: to => { return { path: '/404', query: { path: to.fullPath } } }}])
            // 生成路由hash
            createdRouterHash(menu)
            next({ ...to, replace: true })
        }
        // 比对 to 和 hash 

    }
    next()


})
router.beforeEach(async (to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title + ' - 信息门户管理系统 - ZW'
    }
    next()
})
router.afterEach(() => {
    NProgress.done() // finish progress bar
})