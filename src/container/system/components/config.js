export  const roleConfig_config= [
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
        dataIndex: 'userName'
    },
    {
        title: '手机',
        dataIndex: 'linkTel'
    },
    {
        title: '用户角色',
        dataIndex: 'roleName'
    },
    {
        title: '启用状态',
        dataIndex: 'statusName'
    },
    {
        title: '创建日期',
        dataIndex: 'gmtCreate'
    },
    {
        title: '创建者',
        dataIndex: 'createrName'
    },
    {
        title: '最后操作日期',
        dataIndex: 'gmtModify'
    },
    {
        title: '最后操作者',
        dataIndex: 'modifierName'
    },
    {
        title: '操作',
        dataIndex: '',
        render: '',
        width: 140
    },
  ]