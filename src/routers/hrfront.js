
export default  [
  {
   
    path: '/hrfront',
    component: () => import('@/views/hrfront/dashboard'),
    meta:{
      title:'人力资源'
    }
  },
  {
   
    name: 'hrfront/dashboard',
    component: () => import('@/views/hrfront/dashboard'),
    meta:{
      title:'人力资源'
    }
  },
  {
    
    name: 'attendance/recordlist',
    component: () => import('@/views/hrfront/attendance/recordlist'),
    meta:{
      title:'考勤明细'
    }
  },
 
  {
    
    name: 'attendance/countlist',
    component: () => import('@/views/hrfront/attendance/countlist'),
    meta:{
      title:'考勤总汇'
    }
  },
  {
    
    name: 'workclothes/list',
    component: () => import('@/views/hrfront/workclothes/list'),
    meta:{
      title:'工衣清单'
    }
  },
  {
    
    name: 'workclothes/retrievalist',
    component: () => import('@/views/hrfront/workclothes/retrievalist'),
    meta:{
      title:'工衣领用'
    }
  },
  {
   
    name: 'dormitory/checkinout',
    component: () => import('@/views/hrfront/dormitory/checkinout'),
    meta:{
      title:'入住管理'
    }
  },
  {
   
    name: 'dormitory/dormmonthbill',
    component: () => import('@/views/hrfront/dormitory/roommonthbill'),
    meta:{
      title:'宿舍费用管理'
    }
  },
  {
    
    name: 'dormitory/checkoutauditlist',
    component: () => import('@/views/hrfront/dormitory/checkoutauditlist'),
    meta:{
      title:'搬离审核'
    }
  },
  {
    
    name: 'dormitory/empmonthbill',
    component: () => import('@/views/hrfront/dormitory/empmonthbill'),
    meta:{
      title:'个人分摊费用'
    }
  },
  {
   
    name: 'livecancel/dormitory/liveregister',
    component: () => import('@/views/hrfront/dormitory/liveregister'),
    meta:{
      title:'居住登记'
    }
  },
  {
    
    name: 'livecancel/dormitory/cancelregister',
    component: () => import('@/views/hrfront/dormitory/cancelregister'),
    meta:{
      title:'注销登记'
    }
  },
  {
   
    name: 'personnelmanagement-employee',
    component: () => import('@/views/hrfront/personnelmanagement/personnelmanagement-employee'),
    meta:{
      title:'人事管理'
    }
  },
  {
    
    name: 'personnelmanagement-employee',
    component: () => import('@/views/hrfront/personnelmanagement/personnelmanagement-employee'),
    meta:{
      title:'档案管理'
    }
  },
  {
      
      name: 'adminManagement',
      component: () => import('@/views/hrfront/adminManagement'),
      meta:{
        title:'行政管理'
      }
  },
  {
     
      name: 'logistics',
      component: () => import('@/views/hrfront/logistics'),
      meta:{
        title:'后勤管理'
      }
    },
    {
        
        name: 'CateringManagement',
        component: () => import('@/views/hrfront/CateringManagement'),
        meta:{
          title:'行政管理'
        }
  },
  {
      
      name: 'Wagebasis',
      component: () => import('@/views/hrfront/Wagebasis'),
      meta:{
          title:'工资基础'
      }
  },
  {
    
    name: 'restaurant/restaurantmember',
    component: () => import('@/views/hrfront/restaurant/restaurant'),
    meta:{
        title:'就餐员工设置'
    }
  },
  {
    
    name: 'restaurant/bookmeal',
    component: () => import('@/views/hrfront/restaurant/bookmeal'),
    meta:{
        title:'员工报餐管理'
    }
  },
  {
    
    name: 'restaurant/consumedata',
    component: () => import('@/views/hrfront/restaurant/consumedata'),
    meta:{
        title:'员工报餐统计'
    }
  },
  {
    name: 'recruitDoc',
    component: () => import('@/views/hrfront/recruitment/recruitment'),
    meta:{
        title:'招聘档案'
    }
  },
]
