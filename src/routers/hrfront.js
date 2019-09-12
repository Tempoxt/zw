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
        name: 'frontGateManage',
        component: () =>
            import ('@/views/hrfront/devicemanager/devicelistmanage'),
        meta: {
            title: '考勤门禁设置'
        }
    },
    {
        name: 'commFactor',
        component: () =>
            import ('@/views/hrfront/comissManage/comissionFactor'),
        meta: {
            title: '业务提成系数'
        }
    },
    {
        name: 'productAddRatio',
        component: () =>
            import ('@/views/hrfront/comissManage/proAppreRate'),
        meta: {
            title: '产品增值率'
        }
    },
    {
        name: 'commRecord',
        component: () =>
            import ('@/views/hrfront/comissManage/comissionRecord'),
        meta: {
            title: '业务提成记录'
        }
    },
    {
        name: 'addAccidentIns',
        component: () =>
            import ('@/views/hrfront/staffinsure/addAccide'),
        meta: {
            title: '意外险名单新增'
        }
    },
    {
        name: 'cancelAccidentIns',
        component: () =>
            import ('@/views/hrfront/staffinsure/cancelAccide'),
        meta: {
            title: '意外险名单减少'
        }
    },{
        name: 'accidentInsRecord',
        component: () =>
            import ('@/views/hrfront/staffinsure/accideRecord'),
        meta: {
            title: '意外险扣费记录'
        }
    },
    {
        name: 'addSocialIns',
        component: () =>
            import ('@/views/hrfront/socialFund/socialSecurity/addSecurity'),
        meta: {
            title: '社保名单新增'
        }
    },
    {
        name: 'cancelSocialIns',
        component: () =>
            import ('@/views/hrfront/socialFund/socialSecurity/cancelSecurity'),
        meta: {
            title: '社保名单注销'
        }
    },
    {
        name: 'securitylist',
        component: () =>
            import ('@/views/hrfront/socialFund/socialSecurity/securitylist'),
        meta: {
            title: '社保缴费记录'
        }
    },
    {
        name: 'addReserveFund',
        component: () =>
            import ('@/views/hrfront/socialFund/provideFund/addProfund'),
        meta: {
            title: '公积金名单新增'
        }
    },
    {
        name: 'cancelReserveFund',
        component: () =>
            import ('@/views/hrfront/socialFund/provideFund/cancelProfund'),
        meta: {
            title: '公积金名单注销'
        }
    },
    {
        name: 'fundlist',
        component: () =>
            import ('@/views/hrfront/socialFund/provideFund/profundlist'),
        meta: {
            title: '公积金缴费记录'
        }
    },
    {
        name: 'reserveFundPayRatio',
        component: () =>
            import ('@/views/hrfront/socialFund/provideFund/profundRadio'),
        meta: {
            title: '公积金缴纳比例'
        }
    }, 
    {
        name: 'hrmplan/staffplan',
        component: () =>
            import ('@/views/hrfront/hrmplan/staffPlan/staffPlan'),
        meta: {
            title: '人员编制规划'
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
        name: 'refakelist',
        component: () =>
            import ('@/views/hrfront/attendance/openDisplay/recordlist'),
        meta: {
            title: '考勤明细1'
        }
    },
    {
        name: 'cofakelist',
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
        name: 'hrmblacklist/record',
        component: () =>
            import ('@/views/hrfront/personnelmanagement/hrmblacklist'),
        meta: {
            title: '人员黑名单'
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
        name: 'clothesIssue',
        component: () =>
            import ('@/views/hrfront/workclothes/issue'),
        meta: {
            title: '工衣发放'
        }
    },
    {
        name: 'clothesReport',
        component: () =>
            import ('@/views/hrfront/workclothes/report'),
        meta: {
            title: '工衣报表'
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
        name: 'restconsume',
        component: () =>
            import ('@/views/hrfront/restaurant/record'),
        meta: {
            title: '食堂消费记录'
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
    {
        name: 'introducercost',
        component: () =>
            import ('@/views/hrfront/introducercost/introlist'),
        meta: {
            title: '介绍费汇总'
        }
    },
]