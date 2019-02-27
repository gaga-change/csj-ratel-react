export  const jurisdiction_config= [
  {
      name: '用户管理',
      list: [
          { name: '新增' },
          { name: '查看' },
          { name: '修改' },
          { name: '删除' },
      ]
  },
  {
      name: '商品管理',
      list: [
          { name: '新增' },
          { name: '查看' },
          { name: '修改' },
          { name: '删除' },
      ]
  },
  {
      name: '入库业务单',
      list: [
          { name: '新增' },
          { name: '查看' },
          { name: '修改' },
          { name: '删除' },
      ]
  },
  {
      name: '出库业务单',
      list: [
          { name: '新增' },
          { name: '查看' },
          { name: '修改' },
          { name: '删除' },
      ]
  },
  {
      name: '客户管理',
      list: [
          { name: '新增' },
          { name: '查看' },
          { name: '修改' },
          { name: '删除' },
      ]
  },
  {
      name: '角色管理',
      list: [
          { name: '新增' },
          { name: '查看' },
          { name: '修改' },
          { name: '删除' },
      ]
  },
]


export  const roleConfig_config= [
    {
        title: '序号',
        dataIndex: 'index'
    },
  {
      title: '角色ID',
      dataIndex: 'id'
  },
  {
      title: '角色名称',
      dataIndex: 'roleName'
  },
  {
      title: '角色描述',
      dataIndex: 'roleDesc'
  },
  {
      title: '操作',
      dataIndex: '',
      render: '',
      width: 120
  },
]

export  const userConfig_config= [
    {
        title: '用户名',
        dataIndex: ''
    },
    {
        title: '手机',
        dataIndex: ''
    },
    {
        title: '用户角色',
        dataIndex: ''
    },
    {
        title: '启用状态',
        dataIndex: ''
    },
    {
        title: '创建日期',
        dataIndex: ''
    },
    {
        title: '创建者',
        dataIndex: ''
    },
    {
        title: '最后操作日期',
        dataIndex: ''
    },
    {
        title: '最后操作者',
        dataIndex: ''
    },
    {
        title: '操作',
        dataIndex: '',
        render: '',
        width: 140
    },
  ]