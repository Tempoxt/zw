import Layout from '@/views/layout/layout'


const router = {
  component: Layout,
  path: '/hrfront',
  children: [
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
      path:'dormitory/empmonthbill',
      name: 'dormitory/empmonthbill',
      component: () => import('@/views/hrfront/dormitory/empmonthbill'),
      meta:{
        title:'个人分摊费用'
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
