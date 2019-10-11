/** 商品列表 */
export const commondityColumns = [
  {
    title: '货主商品编码',
    dataIndex: 'ownerSkuCode'
  },
  {
    title: '商品名称',
    dataIndex: 'skuName',
    width: 200
  },
  {
    title: '品牌',
    dataIndex: 'brandName'
  },
  {
    title: '规格',
    dataIndex: 'skuFormat'
  },
  {
    title: '型号',
    dataIndex: 'skuModel'
  },
  {
    title: '单位',
    dataIndex: 'skuUnitName'
  },
  {
    title: '创建日期',
    dataIndex: 'gmtCreate',
    type: 'time',
  },
  {
    title: '创建者',
    dataIndex: 'createrName'
  },
  {
    title: '最后操作日期',
    dataIndex: 'gmtCreate',
    type: 'time',
  },
  {
    title: '最后操作者',
    dataIndex: 'modifierName'
  },
  {
    title: '操作',
    dataIndex: '',
    render: '',
    width: 200
  },
]

/** 商品 - 供货价 */
export const commonditySupplierPriceColums = [
  {
    title: '序号',
    dataIndex: 'index'
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
    title: '供货价',
    dataIndex: 'purchasePrice'
  },
  {
    title: '单位',
    dataIndex: 'largePackUnitName'
  }
]

/** 商品 - 销售价 */
export const commondityCustomerPriceColums = [
  {
    title: '序号',
    dataIndex: 'index'
  },
  {
    title: '客户编码',
    dataIndex: 'customerCode'
  },
  {
    title: '客户名称',
    dataIndex: 'customerName'
  },
  {
    title: '销售价',
    dataIndex: 'sellPrice'
  }
]

/** 计划出库 - 主列表 */
export const planOutListColumns = [
  {
    title: '订单号',
    dataIndex: 'busiBillNo',
  },
  {
    title: '计划出库时间',
    dataIndex: 'arrivalPreDate',
    type: 'time',
  },
  {
    title: '计划出库仓库',
    dataIndex: 'warehouseName',
  },
  {
    title: '计划出库总量',
    dataIndex: 'planOutQty',
  },
  {
    title: '已出库数量',
    dataIndex: 'realOutQty'
  },
  {
    title: '单据状态',
    dataIndex: 'billStatus',
    useLocalEnum: 'billStatusEnum'
  },
  {
    title: '操作',
    dataIndex: '',
    render: '',
    width: 130,
  },
]

/** 计划入库 - 主列表 */
export const planInListColumns = [
  {
    title: '订单号',
    dataIndex: 'busiBillNo',
  },
  {
    title: '计划入库时间',
    dataIndex: 'planInWarehouseTime',
    type: 'time',
  },
  {
    title: '计划入库仓库',
    dataIndex: 'warehouseName',
  },
  {
    title: '计划入库总量',
    dataIndex: 'planInQty',
  },
  {
    title: '已入库数量',
    dataIndex: 'realInQty',
  },
  {
    title: '单据状态',
    dataIndex: 'billStatus',
    useLocalEnum: 'billStatusEnum'
  },
  {
    title: '创建日期',
    dataIndex: 'gmtCreate',
    type: 'time',
    width: 130
  },
  {
    title: '操作',
    dataIndex: '',
    render: '',
    width: 130,
  },
]


/** 入库商品列表 */
export const planInGoodsListColums = [

  {
    title: '商品编号',
    dataIndex: 'skuCode',
  },
  {
    title: '商品名称',
    dataIndex: 'skuName',
  },
  {
    title: '品牌',
    dataIndex: 'brandName',
  },
  {
    title: '规格型号',
    dataIndex: 'skuFormat',
  },
  {
    title: '单位',
    dataIndex: 'largePackUnitName',
  },
  {
    title: '单价（成本）',
    dataIndex: 'purchasePrice',
  }
]
