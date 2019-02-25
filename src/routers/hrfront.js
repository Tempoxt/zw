import Layout from '@/views/layout/layout'


const router = {
  component: Layout,
  path: '/hrfront',
  children: [
    {
      path:'personnelmanagement-employee',
      name: 'personnelmanagement-employee',
      component: () => import('@/views/hrfront/personnelmanagement/personnelmanagement-employee'),
      meta:{
        title:'人事管理'
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
    }
  ]
}
export default router
