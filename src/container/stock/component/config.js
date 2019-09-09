
export const indexTableColumnsConfig = [
  {
    title: '商品编码',
    dataIndex: 'skuCode'
  },
  {
    title: '货主商品编码',
    dataIndex: 'ownerSkuCode'
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
    title: '规格型号',
    dataIndex: 'skuFormat'
  },
  {
    title: '单位',
    dataIndex: 'skuUnitName'
  },
  {
    title: '所属仓库',
    dataIndex: 'warehouseName'
  },
  {
    title: '可用库存',
    dataIndex: 'skuQty',
    render: (v, record) => record.skuQty - record.lockQty
  },
  {
    title: '锁定库存',
    dataIndex: 'lockQty'
  }
]
