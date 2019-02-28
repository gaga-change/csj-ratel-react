
export  const indexTableColumnsConfig=[
  {
    title: '序号',
    dataIndex: 'index',
    width:50
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
    dataIndex: 'receiverName'
  },
  {
    title:'所在地区',
    dataIndex: 'area'
  },
  {
    title:'详细地址',
    dataIndex: 'customerAddress',
    width:220
  },
  {
    title:'邮编',
    dataIndex: 'postalCode'
  },
  {
    title:'手机',
    dataIndex: 'receiverTel'
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
