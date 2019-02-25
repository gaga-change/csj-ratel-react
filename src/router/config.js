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
    indexName:'入库业务',
    path:'/warehousing',
    hidden: false,
    component:'/warehousing/warehousing',
    icon:'warehousing',
    indexIcon:'warehousing_business',
    sort:3,
    children:[],
  },
  { 
    name:'出库',
    indexName:'出库业务',
    path:'/outgoing',
    hidden: false,
    component:'/outgoing/outgoing',
    icon:'outgoing',
    indexIcon:'outbound_business',
    sort:4
  },
  { 
    name:'商品',
    indexName:'商品管理',
    path:'/commodity',
    hidden: false,
    component:'/commodity/commodity',
    icon:'commodity',
    indexIcon:'commodity_management',
    sort:5
  },
  { 
    name:'库存',
    indexName:'库存查询',
    path:'/stock',
    hidden: false,
    component:'/stock/stock',
    icon:'stock',
    indexIcon:'stock_search',
    sort:6
  },
  { 
    name:'客户',
    indexName:'客户列表',
    path:'/customer',
    hidden: false,
    component:'/customer/customer',
    icon:'customer',
    indexIcon:'client_list',
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
        indexName:'角色管理',
        path:'/system/role',
        component:'/system/role',
        indexIcon:'role_management',
        sort:1
      },  
      { 
        name:'用户管理',
        indexName:'用户管理',
        path:'/system/user',
        component:'/system/user',
        indexIcon:'user_management',
        sort:2
      }, 
    ],
    sort:8
  }
]
