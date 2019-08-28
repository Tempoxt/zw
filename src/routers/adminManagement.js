export default [{
        path: '',
        name: '/adminManagement',
        component: () =>
            import ('@/views/hrfront/administr'),
        meta: {
            title: '行政管理'
        }
    },
    {
        name: 'hot',
        component: () => import ('@/views/adminManagement/hot/hot'),
        meta: {
            title: '高温津贴管理'
        }
    }
 ]