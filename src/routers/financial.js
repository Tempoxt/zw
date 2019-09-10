export default [{
        name: 'basicwageList',
        component: () =>
            import ('@/views/finance/salary/basicwage'),
        meta: {
            title: '薪资基础资料'
        }
    },{
        name: 'applywageList',
        component: () =>
            import ('@/views/finance/salary/basicwageApplysheet'),
        meta: {
            title: '薪资调整记录'
        }
    },{
        name: 'invoicerecheck',
        component: () =>
            import ('@/views/finance/productrecheck/invoicerecheck'),
        meta: {
            title: '发票查重管理'
        }
    },
    {
        name: 'salary',
        component: () =>
            import ('@/views/finance/salary/salaryslip'),
        meta: {
            title: '薪资单'
        }
    },
    {
        name: 'applybasic',
        component: () =>
            import ('@/views/finance/salary/applybasic'),
        meta: {
            title: '工薪确认记录'
        }
    },
    {
        name: 'lfMemberManager',
        component: () =>
            import ('@/views/finance/lovefoundation/member'),
        meta: {
            title: '会员管理'
        }
    },
    {
        name: 'lfManager',
        component: () =>
            import ('@/views/finance/lovefoundation/debitcredit'),
        meta: {
            title: '基金管理'
        }
    },
    // {
    //     name: 'feecollecting',
    //     component: () =>
    //         import ('@/views/finance/lovefoundation/feecollecting'),
    //     meta: {
    //         title: '会员缴费'
    //     }
    // },
    {
        name: 'lfStatistic',
        component: () =>
            import ('@/views/finance/countsheet/countsheet'),
        meta: {
            title: '统计报表'
        }
    },
    {
        name: 'securityandfund',
        component: () =>
            import ('@/views/finance/securityandfund/securityandfund'),
        meta: {
            title: '社保公积金'
        }
    },
    {
        name: 'deductionlist',
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
    },
    {
        name: 'salary/achievement',
        component: () =>
            import ('@/views/finance/salary/achievement'),
        meta: {
            title: '月份绩效考核'
        }
    },
    {
        name: 'staffSalary',
        component: () =>
            import ('@/views/finance/salary/staffSalary'),
        meta: {
            title: '月份绩效考核'
        }
    },
]