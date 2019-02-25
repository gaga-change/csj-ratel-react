export  const routerConfig=[
  { 
    name:'首页',
    path:'/',
    hidden: false,
    component:'/home/home',
    icon:'home',
    sort:1,
    must:true
  },
  { 
    name:'登录页',
    path:'/login',
    hidden: true,
    component:'/login/login',
    icon:'',
    sort:2,
    must:true
  },
  { 
    name:'入库',
    path:'/warehousing',
    hidden: false,
    component:'/warehousing/warehousing',
    icon:'warehousing',
    sort:3,
    children:[],
  },
  { 
    name:'出库',
    path:'/outgoing',
    hidden: false,
    component:'/outgoing/outgoing',
    icon:'outgoing',
    sort:4
  },
  { 
    name:'商品',
    path:'/commodity',
    hidden: false,
    component:'/commodity/commodity',
    icon:'commodity',
    sort:5
  },
  { 
    name:'库存',
    path:'/stock',
    hidden: false,
    component:'/stock/stock',
    icon:'stock',
    sort:6
  },
  { 
    name:'客户',
    path:'/customer',
    hidden: false,
    component:'/customer/customer',
    icon:'customer',
    sort:7
  },
  { 
    name:'系统',
    path:'/system',
    hidden: false,
    component:'/system/user',
    icon:'system',
    children:[
      { 
        name:'角色管理',
        path:'/system/role',
        component:'/system/role',
        sort:1
      },  
      { 
        name:'用户管理',
        path:'/system/user',
        component:'/system/user',
        sort:2
      }, 
    ],
    sort:8
  }
]
