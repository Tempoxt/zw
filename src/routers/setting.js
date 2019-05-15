import Layout from '@/views/layout/layout'

const router = {
  component: Layout,
  path: '/setting',
  children: [
    {
      path:'sysdic',
      name: 'sysdic',
      component: () => import('@/views/setting/sysdic'),
      meta:{
        title:'数据字典'
      }
    },
  ]
}
export default router
