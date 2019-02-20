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
      path:'restaurant-meallevel',
      name: 'mealtype',
      component: () => import('@/views/hr/restaurant-meallevel'),
      meta:{
        title:'餐次类型'
      }
    },
    {
      path:'restaurant-meal',
      name: 'mealsetting',
      component: () => import('@/views/hr/restaurant-meal'),
      meta:{
        title:'餐次设置'
      }
    },
    {
      path:'restaurant-restaurantmeal',
      name: 'mealsetting',
      component: () => import('@/views/hr/restaurant-restaurantmeal'),
      meta:{
        title:'餐厅餐次设置'
      }
    }
  ]
}
export default router
