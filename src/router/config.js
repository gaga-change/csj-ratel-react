export  const routerConfig=[
  { 
    name:'首页',
    path:'/',
    hidden: false,
    component:'/home/home',
    icon:'home',
  },
  { 
    name:'登录页',
    path:'/login',
    hidden: true,
    component:'/login/login',
    icon:'',
  },
  { 
    name:'入库',
    path:'/warehousing',
    hidden: false,
    component:'/warehousing/warehousing',
    icon:'warehousing'
  },
  { 
    name:'出库',
    path:'/outgoing',
    hidden: false,
    component:'/outgoing/outgoing',
    icon:'outgoing',
  },
  { 
    name:'商品',
    path:'/commodity',
    hidden: false,
    component:'/commodity/commodity',
    icon:'commodity',
  },
  { 
    name:'库存',
    path:'/stock',
    hidden: false,
    component:'/stock/stock',
    icon:'stock',
  },
  { 
    name:'客户',
    path:'/customer',
    hidden: false,
    component:'/customer/customer',
    icon:'customer',
  },
  { 
    name:'系统',
    path:'/system',
    hidden: false,
    component:'/system/system',
    icon:'system',
    children:[
    
    ]
  },
]
