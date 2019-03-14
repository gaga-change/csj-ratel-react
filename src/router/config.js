
export  const routerConfig=[
  { 
    name:'首页',//左侧菜单栏菜单名称
    path:'/home',//路由  
    hidden: false,//是否在左侧菜单栏展示
    component:'/home/home',//使用的组件路径   此处逻辑 loader: () => import(`../container${v.component}`),
    icon:'home',//菜单icon  此处icon为本地图片  请选择@imgSouce/imgSouce.js imgSouce对象下未带_click的属性
    sort:1,//菜单排序,数字越小越靠前
    must:true//是否为必须菜单,设置为此属性后即使后端不返回该菜单,前端依然可以从本地读取
  },
  { 
    name:'登录页',
    path:'/web_login',
    hidden: true,
    component:'/login/login',
    icon:'',
    sort:2,
    must:true
  },
  { 
    name:'入库',
    indexName:'入库业务',//首页快捷入口菜单名  设置该属性后快捷入口才会展示该菜单   不设置不展示 
    path:'/warehousing',
    hidden: false,
    component:'/warehousing/warehousing',
    icon:'warehousing',
    indexIcon:'warehousing_business',//快捷入口菜单图标 此处icon为本地图片  请选择@imgSouce/imgSouce.js imgSouce对象下未带_click的属性
    sort:3
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
    Redirect:'/system/user',
    hidden: false,
    component:'/system/user',
    icon:'system',
    children:[  //支持二级菜单  只需设置children属性即可 然后以同种方式配置子菜单即可   不支持三级菜单
      { 
        name:'角色管理',//侧边栏菜单名
        indexName:'角色管理',//在快捷入口展示  菜单名为角色管理
        path:'/system/role',//路由
        component:'/system/role',//组件路径
        indexIcon:'role_management',//快捷入口菜单图标
        sort:1//排序
      },
      { 
        name:'菜单管理',
        path:'/system/menu',
        hidden: true,//是否隐藏
        component:'/system/menu',
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
      { 
        name:'修改密码',
        indexName:'修改密码',
        path:'/system/setPass',
        component:'/system/setPass',
        indexIcon:'change_password',
        sort:3,
        must:true
      },
    ],
    sort:8
  }
]
