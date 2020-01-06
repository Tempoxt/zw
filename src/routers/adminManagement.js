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
        name: 'restaurantmember',
        component: () =>
            import ('@/views/hrfront/restaurant/restaurant'),
        meta: {
            title: '就餐员工设置'
        }
    },
    {
        name: 'bookmeal',
        component: () =>
            import ('@/views/hrfront/restaurant/bookmeal'),
        meta: {
            title: '员工报餐管理'
        }
    },
    {
        name: 'consumedata',
        component: () =>
            import ('@/views/hrfront/restaurant/consumedata'),
        meta: {
            title: '员工报餐统计'
        }
    },
    {
        name: 'restconsume',
        component: () =>
            import ('@/views/hrfront/restaurant/record'),
        meta: {
            title: '食堂消费记录'
        }
    },
    {
        name: 'consume',
        component: () =>
            import ('@/views/hrfront/restaurant/consumeDetail'),
        meta: {
            title: '报餐消费明细'
        }
    },
    {
        name: 'hot',
        component: () => import ('@/views/adminManagement/hot/hot'),
        meta: {
            title: '高温津贴管理'
        }
    },
    {
        name: 'checkinout',
        component: () =>
            import ('@/views/hrfront/dormitory/checkinout'),
        meta: {
            title: '入住管理'
        }
    },
    {
        name: 'dormmonthbill',
        component: () =>
            import ('@/views/hrfront/dormitory/roommonthbill'),
        meta: {
            title: '宿舍费用管理'
        }
    },
    {
        name: 'dormCheckoutAudit',
        component: () =>
            import ('@/views/hrfront/dormitory/checkoutauditlist'),
        meta: {
            title: '搬离审核'
        }
    },
    {
        name: 'empmonthbill',
        component: () =>
            import ('@/views/hrfront/dormitory/empmonthbill'),
        meta: {
            title: '个人分摊费用'
        }
    },
    {
        name: 'liveRegister',
        component: () =>
            import ('@/views/hrfront/dormitory/liveregister'),
        meta: {
            title: '居住登记'
        }
    },
    {
        name: 'cancelRegister',
        component: () =>
            import ('@/views/hrfront/dormitory/cancelregister'),
        meta: {
            title: '注销登记'
        }
    },
    {
        name: 'checklistview',
        component: () =>
            import ('@/views/hrfront/dormitory/checklistview'),
        meta: {
            title: '入住待处理清单'
        }
    }, {
        name: 'dormdailyrecord',
        component: () =>
            import ('@/views/hrfront/dormitory/dormdailyrecord'),
        meta: {
            title: '入住异常管理'
        }
    },{
        name: 'inventory',
        component: () =>
            import ('@/views/adminManagement/itemManage/itemList'),
        meta: {
            title: '物品清单'
        }
    }, {
        name: 'standardDose',
        component: () =>
            import ('@/views/adminManagement/itemManage/standardDose'),
        meta: {
            title: '标准用量'
        }
    },{
        name: 'moveRecord',
        component: () =>
            import ('@/views/adminManagement/itemManage/moveRecord'),
        meta: {
            title: '流转记录'
        }
    },
    {
        name: 'personLedger',
        component: () =>
            import ('@/views/adminManagement/itemManage/personLedger'),
        meta: {
            title: '个人台账'
        }
    },{
        name: 'wareStat',
        component: () =>
            import ('@/views/adminManagement/itemManage/warestat'),
        meta: {
            title: '仓库统计表'
        }
    },{
        name: 'departLedger',
        component: () =>
            import ('@/views/adminManagement/itemManage/departLedger'),
        meta: {
            title: '部门台账'
        }
    },{
        name: 'idleFixedAssets',
        component: () =>
            import ('@/views/adminManagement/itemManage/idleAssets'),
        meta: {
            title: '闲置固定资产'
        }
    },
 ]