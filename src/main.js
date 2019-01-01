import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-ui'
import {
  sync
} from 'vuex-router-sync'

import '@assets/style/theme/0BB2D4/index.css'
import '@assets/style/theme/DC5D03/index.css'
import '@assets/style/theme/F2353C/index.css'
import '@assets/style/theme/9463F7/index.css'

import '@assets/iconfont/iconfont.css'
// import 'element-ui/lib/theme-chalk/index.css'
import '@assets/style/index.scss'
// import '@assets/style/element-variables.scss'
import './config/permission'

import iView from 'iview'
import 'iview/dist/styles/iview.css'

// import '@assets/style/theme/test/index.css'
sync(store, router)
Vue.use(iView)

Vue.config.productionTip = false
Vue.mixin({
  methods: {
    $t (s) {
      return s
    }
  }
})
Vue.use(Element, {
  size: 'small' // set element-ui default size
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
