export default [{
        name: 'basicwage',
        component: () =>
            import ('@/views/finance/salary/basicwage'),
        meta: {
            title: '薪资基础资料'
        }
    },
    {
        name: 'basicwage/applysheet/2',
        component: () =>
            import ('@/views/finance/salary/basicwageApplysheet'),
        meta: {
            title: '薪资调整记录'
        }
    },
    {
        name: 'basicwage/applysheet/1',
        component: () =>
            import ('@/views/finance/salary/applybasic'),
        meta: {
            title: '工薪确认记录'
        }
    },
    {
        name: 'lovefoundation/member',
        component: () =>
            import ('@/views/finance/lovefoundation/member'),
        meta: {
            title: '会员管理'
        }
    },
    {
        name: 'lovefoundation/foundin/lovefoundation/foundin',
        component: () =>
            import ('@/views/finance/lovefoundation/foundin'),
        meta: {
            title: '会员管理'
        }
    },
    {
        name: 'lovefoundation/feecollecting',
        component: () =>
            import ('@/views/finance/lovefoundation/feecollecting'),
        meta: {
            title: '会员缴费'
        }
    },
    {
        name: 'securityandfund/securityandfund',
        component: () =>
            import ('@/views/finance/securityandfund/securityandfund'),
        meta: {
            title: '社保公积金'
        }
    },
    {
        name: 'security/deductionlist',
        component: () =>
            import ('@/views/finance/security/deductionlist'),
        meta: {
            title: '专项扣除'
        }
    },
    {
        name: 'deduction',
        component: () =>
            import ('@/views/finance/deduction/deduction'),
        meta: {
            title: '补扣款管理'
        }
    }
]