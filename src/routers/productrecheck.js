export default [
    {
        name: 'AvoidDuplication',
        component: () => import ('@/views/product/productrecheck/productrecheck'),
        meta: {
            title: '产品防重'
        }
    },
    {
        name: 'GMScanRecord',
        component: () => import ('@/views/product/gm/gm'),
        meta: {
            title: 'GM19015'
        }
    },
    {
        name: 'OperateList',
        component: () => import ('@/views/product/operate/operate'),
        meta: {
            title: '操作名单'
        }
    },
    {
        name: 'productionHoursForm',
        component: () => import ('@/views/product/productionHours'),
        meta: {
            title: '生产工时登记'
        }
    }
 ]