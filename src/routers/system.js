export default [
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
    },
    {
      path: 'operatelog',
      name: 'operatelog',
      meta: {
        title: '操作日志'
      },
      component: () => import('@/views/system/opratelog')
    },
    {
      path: 'loginlog',
      name: 'loginlog',
      meta: {
        title: '登录日志'
      },
      component: () => import('@/views/system/loginlog')
    },
    {
      path: 'loginlist',
      name: 'loginlist',
      meta: {
        title: '登陆黑白名单'
      },
      component: () => import('@/views/Null')
    }
  ]