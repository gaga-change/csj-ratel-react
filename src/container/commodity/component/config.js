
export  const indexTableColumnsConfig=[
  {
    title:'商品编码',
    dataIndex:'skuCode'
  },
  {
    title:'商品名称',
    dataIndex:'skuName'
  },
  {
    title:'品牌',
    dataIndex:'brandName'
  },
  {
    title:'规格型号',
    dataIndex:'skuFormat'
  },
  {
    title:'单位',
    dataIndex:'skuUnitName'
  },
  {
    title:'创建日期',
    dataIndex:'gmtCreate',
    type:'time',
  },
  {
    title:'创建者',
    dataIndex:'createrName'
  },
  {
    title:'最后操作日期',
    dataIndex:'gmtCreate',
    type:'time',
  },
  {
    title:'最后操作者',
    dataIndex:'modifierName'
  },
  {
    title:'操作',
    dataIndex: '',
    render:'',
    width:200
  },
]

export  const priceChange_config=[
  {
    title: '售价',
    dataIndex:'salePrice'
  },
  {
    title:'变动日期',
    dataIndex:'gmtCreate',
    type:'time',
  },
  {
    title:'操作人',
    dataIndex:'createrName'
  },
]
