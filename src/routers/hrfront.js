export default [{
        path: '',
        name: '/hrfront',
        component: () =>
            import ('@/views/hrfront/dashboard'),
        meta: {
            title: '人力资源'
        }
    },

    {
        name: 'attendanceDetail',
        component: () =>
            import ('@/views/hrfront/attendance/recordlist'),
        meta: {
            title: '考勤明细'
        }
    },
    {
        name: 'attendaceList',
        component: () =>
            import ('@/views/hrfront/attendance/countlist'),
        meta: {
            title: '考勤总汇'
        }
    },
    {
        name: 'attendanceDetail',
        component: () =>
            import ('@/views/hrfront/attendance/openDisplay/recordlist'),
        meta: {
            title: '考勤明细1'
        }
    },
    {
        name: 'attendaceList',
        component: () =>
            import ('@/views/hrfront/attendance/openDisplay/countlist'),
        meta: {
            title: '考勤总汇1'
        }
    },
    {
        name: 'employeeDoc',
        component: () =>
            import ('@/views/hrfront/personnelmanagement/personnelmanagement-employee'),
        meta: {
            title: '员工档案'
        }
    },
    {
        name: 'onDuty',
        component: () =>
            import ('@/views/hrfront/personnelmanagement/personnelmanagement'),
        meta: {
            title: '在职员工'
        }
    },
    {
        name: 'outDuty',
        component: () =>
            import ('@/views/hrfront/personnelmanagement/personnelmanagementOut'),
        meta: {
            title: '离职员工'
        }
    },
    {
        name: 'transfer/record',
        component: () =>
            import ('@/views/hrfront/personnelmanagement/transfer'),
        meta: {
            title: '人员调动'
        }
    },
    {
        name: 'clothesList',
        component: () =>
            import ('@/views/hrfront/workclothes/list'),
        meta: {
            title: '工衣清单'
        }
    },
    {
        name: 'clothesRetrieval',
        component: () =>
            import ('@/views/hrfront/workclothes/retrievalist'),
        meta: {
            title: '工衣领用'
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
    // {
    //     name: 'personnelmanagement-employee',
    //     component: () =>
    //         import ('@/views/hrfront/personnelmanagement/personnelmanagement-employee'),
    //     meta: {
    //         title: '人事管理'
    //     }
    // },
    // {
    //     name: 'personnelmanagement-employee',
    //     component: () =>
    //         import ('@/views/hrfront/personnelmanagement/personnelmanagement-employee'),
    //     meta: {
    //         title: '档案管理'
    //     }
    // },
    {
        name: 'outDutyLog',
        component: () =>
            import ('@/views/hrfront/personnelmanagement/outDutyLog'),
        meta: {
            title: '离职登记'
        }
    },
    {
        name: 'adminManagement',
        component: () =>
            import ('@/views/hrfront/adminManagement'),
        meta: {
            title: '行政管理'
        }
    },
    {
        name: 'supportManager',
        component: () =>
            import ('@/views/hrfront/logistics'),
        meta: {
            title: '后勤管理'
        }
    },
    {
        name: 'CateringManagement',
        component: () =>
            import ('@/views/hrfront/CateringManagement'),
        meta: {
            title: '行政管理'
        }
    },
    {
        name: 'Wagebasis',
        component: () =>
            import ('@/views/hrfront/Wagebasis'),
        meta: {
            title: '工资基础'
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
        name: 'recruitDoc',
        component: () =>
            import ('@/views/hrfront/recruitment/recruitment'),
        meta: {
            title: '招聘档案'
        }
    },
    {
        name: 'checklistview',
        component: () =>
            import ('@/views/hrfront/dormitory/checklistview'),
        meta: {
            title: '入住待处理清单'
        }
    },
    
]