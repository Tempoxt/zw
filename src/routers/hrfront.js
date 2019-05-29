import Layout from '@/views/layout/layout'


const router = {
  component: Layout,
  path: '/hrfront',
  // redirect:'/hrfront/dashboard',
  children: [
    {
      path:'/hrfront/dashboard',
      name: 'hrfront/dashboard',
      component: () => import('@/views/hrfront/dashboard'),
      meta:{
        title:'人力资源'
      }
    },
    {
      path:'attendance/recordlist',
      name: 'attendance/recordlist',
      component: () => import('@/views/hrfront/attendance/recordlist'),
      meta:{
        title:'考勤明细'
      }
    },
   
    {
      path:'attendance/countlist',
      name: 'attendance/countlist',
      component: () => import('@/views/hrfront/attendance/countlist'),
      meta:{
        title:'考勤总汇'
      }
    },
    {
      path:'workclothes/list',
      name: 'workclothes/list',
      component: () => import('@/views/hrfront/workclothes/list'),
      meta:{
        title:'工衣清单'
      }
    },
    {
      path:'workclothes/retrievalist',
      name: 'workclothes/retrievalist',
      component: () => import('@/views/hrfront/workclothes/retrievalist'),
      meta:{
        title:'工衣领用'
      }
    },
    {
      path:'dormitory/checkinout',
      name: 'dormitory/checkinout',
      component: () => import('@/views/hrfront/dormitory/checkinout'),
      meta:{
        title:'入住管理'
      }
    },
    {
      path:'dormitory/dormmonthbill',
      name: 'dormitory/dormmonthbill',
      component: () => import('@/views/hrfront/dormitory/roommonthbill'),
      meta:{
        title:'宿舍费用管理'
      }
    },
    {
      path:'dormitory/checkoutauditlist',
      name: 'dormitory/checkoutauditlist',
      component: () => import('@/views/hrfront/dormitory/checkoutauditlist'),
      meta:{
        title:'搬离审核'
      }
    },
    {
      path:'dormitory/empmonthbill',
      name: 'dormitory/empmonthbill',
      component: () => import('@/views/hrfront/dormitory/empmonthbill'),
      meta:{
        title:'个人分摊费用'
      }
    },
    {
      path:'livecancel/dormitory/liveregister',
      name: 'livecancel/dormitory/liveregister',
      component: () => import('@/views/hrfront/dormitory/liveregister'),
      meta:{
        title:'居住登记'
      }
    },
    {
      path:'livecancel/dormitory/cancelregister',
      name: 'livecancel/dormitory/cancelregister',
      component: () => import('@/views/hrfront/dormitory/cancelregister'),
      meta:{
        title:'注销登记'
      }
    },
    {
      path:'personnelmanagement-employee',
      name: 'personnelmanagement-employee',
      component: () => import('@/views/hrfront/personnelmanagement/personnelmanagement-employee'),
      meta:{
        title:'人事管理'
      }
    },
    {
      path:'personnelmanagement/personnelmanagement',
      name: 'personnelmanagement-employee',
      component: () => import('@/views/hrfront/personnelmanagement/personnelmanagement-employee'),
      meta:{
        title:'档案管理'
      }
    },
    {
        path:'adminManagement',
        name: 'adminManagement',
        component: () => import('@/views/hrfront/adminManagement'),
        meta:{
          title:'行政管理'
        }
    },
    {
        path:'logistics',
        name: 'logistics',
        component: () => import('@/views/hrfront/logistics'),
        meta:{
          title:'后勤管理'
        }
      },
      {
          path:'CateringManagement',
          name: 'CateringManagement',
          component: () => import('@/views/hrfront/CateringManagement'),
          meta:{
            title:'行政管理'
          }
    },
    {
        path:'Wagebasis',
        name: 'Wagebasis',
        component: () => import('@/views/hrfront/Wagebasis'),
        meta:{
            title:'工资基础'
        }
    },
    {
      path:'restaurant/restaurantmember',
      name: 'restaurant/restaurantmember',
      component: () => import('@/views/hrfront/restaurant/restaurant'),
      meta:{
          title:'就餐员工设置'
      }
    },
    {
      path:'restaurant/bookmeal',
      name: 'restaurant/bookmeal',
      component: () => import('@/views/hrfront/restaurant/bookmeal'),
      meta:{
          title:'员工报餐管理'
      }
    },
    {
      path:'restaurant/consumedata',
      name: 'restaurant/consumedata',
      component: () => import('@/views/hrfront/restaurant/consumedata'),
      meta:{
          title:'员工报餐统计'
      }
    },
    {
      path:'recruitment/recruitment',
      name: 'recruitment/recruitment',
      component: () => import('@/views/hrfront/recruitment/recruitment'),
      meta:{
          title:'招聘档案'
      }
    },
    
    
  ]
}
export default router
