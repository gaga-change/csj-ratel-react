export  const priceChange_config=[
  {
    name: '本周入库',
    orderNumber_dataIndex:'inWarehouseOrderNum',//单数的索引
    orderPiece_dataIndex:'inWarehouseSkuNum',//件数的索引 没有该字段则不展示该字段
    icon:'home_in'//icon的索引
  },
  {
    name: '本周出库',
    orderNumber_dataIndex:'outWarehouseOrderNum',
    orderPiece_dataIndex:'outWarehouseSkuNum',
    icon:'home_out'
  },
  {
    name: '商品库存',
    orderNumber_dataIndex:'skuStockNum',
    icon:'home_repo'
  },
]