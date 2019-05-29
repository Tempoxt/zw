import Layout from '@/views/layout/layout'


const router = {
  component: Layout,
  path: '/adminManagement',
  children: [
    {
        path:'hot',
        name: 'hot/hot',
        component: () => import('@/views/hrfront/hot/hot'),
        meta:{
            title:'高温津贴管理'
        }
    },

  ]
}
export default router
