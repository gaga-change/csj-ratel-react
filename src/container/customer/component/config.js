
export  const indexTableColumnsConfig=[
  {
    title: '序号',
    dataIndex: 'index'
  },
  {
    title:'客户编码',
    dataIndex: 'customerCode'
  },
  {
    title:'客户名称',
    dataIndex: 'customerName'
  },
  {
    title:'负责人',
    dataIndex: 'customerLinkUser'
  },
  {
    title:'手机',
    dataIndex: 'customerLinkuserTel'
  },
  {
    title:'操作',
    dataIndex: '',
    render:'',
    width:150
  },
]

export  const addressTableColumnsConfig=[
  {
    title: '序号',
    dataIndex: 'index'
  },
  {
    title: '收货人',
    dataIndex: ''
  },
  {
    title:'所在地区',
    dataIndex: ''
  },
  {
    title:'详细地址',
    dataIndex: ''
  },
  {
    title:'邮编',
    dataIndex: ''
  },
  {
    title:'手机',
    dataIndex: ''
  },
  {
    title:'操作',
    dataIndex: '',
    render:'',
    renderType:'operation',
    width:120
  },
  {
    title:'',
    dataIndex: '',
    render:'',
    renderType:'tag',
    width:100
  },
]
