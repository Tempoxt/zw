import Layout from '@/views/layout/layout'

const router = {
  component: Layout,
  path: '/salary',
  children: [
    {
      path:'deduction',
      name: 'deduction',
      component: () => import('@/views/salary/deduction/deduction'),
      meta:{
        title:'补扣款管理'
      }
    },
  ]
}
export default router
