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
    ...personnel
  ]
}
export default router
