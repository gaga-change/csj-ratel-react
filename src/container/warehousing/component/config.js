export  const indexTableColumns_Config=[
  {
    title: '业务单编号',
    dataIndex:'planCode',
  },
  {
    title:'计划入库时间',
    dataIndex:'planTime',
    type:'time',
  },
  {
    title:'计划入库仓库',
    dataIndex:'planWarehouseName',
  },
  {
    title:'计划入库总量',
    dataIndex:'inPlanQty',
  },
  {
    title:'已入库数量',
    dataIndex:'inQty',
  },
  {
    title:'单据状态',
    dataIndex:'planState',
    useLocalEnum:'warehousing_planStateEnum'
  },
  {
    title:'操作',
    dataIndex: '',
    render:'',
    width:130,
  },
]


export  const indexTableColumns_ChildConfig=[
  {
    title:'商品编码',
    dataIndex:'skuCode',
  },
  {
    title:'商品名称',
    dataIndex:'skuName',
  },
  {
    title:'单价',
    dataIndex:'inPrice',
  },
  {
    title:'计划入库数量',
    dataIndex:'planInQty',
  },
  {
    title:'已入库总量',
    dataIndex:'realInQty',
  },
  
]

export  const formTable_config=[
  {
    title: '序号',
    dataIndex: 'index',
  },
  {
    title:'商品编号',
    dataIndex:'skuCode',
  },
  {
    title:'商品名称',
    dataIndex:'skuName',
  },
  {
    title:'品牌',
    dataIndex:'brandName',
  },
  {
    title:'规格型号',
    dataIndex:'skuFormat',
  },
  {
    title:'单位',
    dataIndex:'skuUnitName',
  },
  {
    title:'单价（成本）',
    dataIndex:'salePrice',
  },
  {
    title:'入库数量',
    dataIndex:'planInQty',
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
    dataIndex:'skuCode',
  },
  {
    title:'商品名称',
    dataIndex:'skuName',
  },
  {
    title:'品牌',
    dataIndex:'brandName',
  },
  {
    title:'规格型号',
    dataIndex:'skuFormat',
  },
  {
    title:'单位',
    dataIndex:'skuUnitName',
  },
  {
    title:'单价（成本）',
    dataIndex:'costPrice',
  }
]


export  const warehousingDetail_Config=[
  {
    title: '序号',
    dataIndex: 'index',
  },
  {
    title:'商品编码',
    dataIndex:'skuCode',
  },
  {
    title:'商品名称',
    dataIndex:'skuName',
  },
  {
    title:'品牌',
    dataIndex:'skuBrandCode',
  },
  {
    title:'规格型号',
    dataIndex:'skuFormat',
  },
  {
    title:'单位',
    dataIndex:'skuUnitCode',
  },
  {
    title:'单价(成本)',
    dataIndex:'inPrice',
  },
  {
    title:'计划入库量',
    dataIndex:'planInQty',
  },
  {
    title:'已入库量',
    dataIndex:'realInQty',
  }
]


export  const BaseCard_Config=[
  {
    title: '业务单编号',
    dataIndex:'planCode',
  },
  {
    title:'计划入库日期',
    dataIndex:'planTime',
    type:'time'
  },
  {
    title:'入库仓库',
    dataIndex:'planWarehouseName',
  },
  {
    title:'计划入库总量',
    dataIndex:'inPlanQty',
  },
  {
    title:'创建人',
    dataIndex:'createrName',
  },
  {
    title:'创建日期',
    dataIndex:'gmtCreate',
  },
  {
    title:'状态',
    dataIndex:'planState',
  },

]