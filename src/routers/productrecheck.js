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
    }
 ]