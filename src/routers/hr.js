import Layout from '@/views/layout/layout'

const personnel = [
  {
    path: 'information',
    component: () => import('@/views/hr/personnel-information')
  }
]
const router = {
  component: Layout,
  path: '/hr',
  children: [
    ...personnel,
    {
      path:'restaurant',
      name: 'restaurant',
      component: () => import('@/views/hr/restaurant'),
      meta:{
        title:'餐厅设置'
      }
    },
    {
      path:'mealtype',
      name: 'mealtype',
      component: () => import('@/views/hr/mealtype'),
      meta:{
        title:'餐次类型'
      }
    },
    {
      path:'mealsetting',
      name: 'mealsetting',
      component: () => import('@/views/hr/mealsetting'),
      meta:{
        title:'餐次设置'
      }
    }
  ]
}
export default router
