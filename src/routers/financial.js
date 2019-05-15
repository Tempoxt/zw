import Layout from '@/views/layout/layout'


const router = {
  component: Layout,
  path: '/cw',
  children: [
    {
      path:'lovefoundation/member',
      name: 'lovefoundation/member',
      component: () => import('@/views/finance/lovefoundation/member'),
      meta:{
        title:'会员管理'
      }
    },
    {
        path:'lovefoundation/feecollecting',
        name: 'lovefoundation/feecollecting',
        component: () => import('@/views/finance/lovefoundation/feecollecting'),
        meta:{
          title:'会员缴费'
        }
    },
    {
      path:'securityandfund/securityandfund',
      name: 'securityandfund/securityandfund',
      component: () => import('@/views/finance/securityandfund/securityandfund'),
      meta:{
        title:'社保公积金'
      }
    },
    {
      path:'security/deductionlist',
      name: 'security/deductionlist',
      component: () => import('@/views/finance/security/deductionlist'),
      meta:{
        title:'专项扣除'
      }
    },
    {
      path:'deduction',
      name: 'deduction',
      component: () => import('@/views/finance/deduction/deduction'),
      meta:{
        title:'补扣款管理'
      }
    },

  ]
}
export default router
