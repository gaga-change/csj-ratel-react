/** 商品列表 */
export const commondityColumns = [
  {
    title: '货主商品编码',
    dataIndex: 'skuCode'
  },
  {
    title: '商品名称',
    dataIndex: 'skuName'
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
    width: 150
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