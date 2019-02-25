import moment from 'moment'
export  const indexTableColumns_Config=[
  {
    title: '业务单编号',
    dataIndex: 'ceshi',
  },
  {
    title:'计划出库时间',
    dataIndex: '',
  },
  {
    title:'计划出库仓库',
    dataIndex: '',
  },
  {
    title:'计划出库总量',
    dataIndex: '',
  },
  {
    title:'已出库数量',
    dataIndex: '',
  },
  {
    title:'单据状态',
    dataIndex: '',
  },
  {
    title:'操作',
    dataIndex: '',
    render:'',
    width:150,
  },
]


export  const indexTableColumns_ChildConfig=[
  {
    title: '商品信息',
    dataIndex: 'id',
  },
  {
    title:'单价',
    dataIndex: '',
  },
  {
    title:'计划出库数量',
    dataIndex: '',
  },
  {
    title:'已出库总量',
    dataIndex: '',
  },
  
]

export  const formTable_config=[
  {
    title: '序号',
    dataIndex: 'index',
  },
  {
    title:'商品编号',
    dataIndex: '',
  },
  {
    title:'商品名称',
    dataIndex: '',
  },
  {
    title:'品牌',
    dataIndex: '',
  },
  {
    title:'规格型号',
    dataIndex: '',
  },
  {
    title:'单位',
    dataIndex: '',
  },
  {
    title:'单价（成本）',
    dataIndex: '',
  },
  {
    title:'仓库',
    dataIndex: '',
  },
  {
    title:'出库数量',
    dataIndex: 'num',
    editable:true,
    inputType:'InputNumber',
    width:120,
  },
  {
    title:'操作',
    dataIndex: '',
    render:'',
    width:100,
  },
  
]


export  const goodsInStorage_config=[

  {
    title:'商品编号',
    dataIndex: 'id',
  },
  {
    title:'商品名称',
    dataIndex: '',
  },
  {
    title:'品牌',
    dataIndex: '',
  },
  {
    title:'规格型号',
    dataIndex: '',
  },
  {
    title:'单位',
    dataIndex: '',
  },
  {
    title:'单价（成本）',
    dataIndex: '',
  },
  {
    title:'仓库',
    dataIndex: '',
  },
  {
    title:'可用库存',
    dataIndex: '',
  },
]


export  const warehousingDetail_Config=[
  {
    title: '序号',
    dataIndex: 'index',
  },
  {
    title:'商品编码',
    dataIndex: '',
  },
  {
    title:'商品名称',
    dataIndex: '',
  },
  {
    title:'品牌',
    dataIndex: '',
  },
  {
    title:'规格型号',
    dataIndex: '',
  },
  {
    title:'单位',
    dataIndex: '',
  },
  {
    title:'单价(销售价)',
    dataIndex: '',
  },
  {
    title:'计划出库量',
    dataIndex: '',
  },
  {
    title:'已出库量',
    dataIndex: '',
  }
]


export  const BaseCard_Config=[
  {
    title: '业务单编号',
    dataIndex: 'orderId',
  },
  {
    title:'计划出库日期',
    dataIndex: 'time',
    render:(v)=>moment(v).format('YYYY-MM-DD')
  },
  {
    title:'出库仓库',
    dataIndex: '',
  },
  {
    title:'计划出库总量',
    dataIndex: '',
  },
  {
    title:'创建人',
    dataIndex: '',
  },
  {
    title:'创建日期',
    dataIndex: '',
  },
  {
    title:'状态',
    dataIndex: '',
  },

]