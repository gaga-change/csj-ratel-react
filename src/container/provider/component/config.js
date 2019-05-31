
export const indexTableColumnsConfig = [
  {
    title: '序号',
    dataIndex: 'index',
    width: 50
  },
  {
    title: '供应商编码',
    dataIndex: 'providerCode'
  },
  {
    title: '供应商名称',
    dataIndex: 'providerName'
  },
  {
    title: '操作',
    dataIndex: '',
    render: '',
    width: 150
  },
]

export const addressTableColumnsConfig = [
  {
    title: '序号',
    dataIndex: 'index'
  },
  {
    title: '收货人',
    dataIndex: 'receiverName'
  },
  {
    title: '所在地区',
    dataIndex: 'area'
  },
  {
    title: '详细地址',
    dataIndex: 'providerAddress',
    width: 220
  },
  {
    title: '邮编',
    dataIndex: 'postalCode'
  },
  {
    title: '手机',
    dataIndex: 'receiverTel'
  },
  {
    title: '操作',
    dataIndex: '',
    render: '',
    renderType: 'operation',
    width: 120
  },
  {
    title: '',
    dataIndex: '',
    render: '',
    renderType: 'tag',
    width: 100
  },
]
