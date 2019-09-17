export const priceChange_config = [
  {
    name: '今日入库',//标题
    orderNumber_dataIndex: 'inWarehouseOrderNum',//单数的索引  没有该字段则不展示该字段
    orderNumber_Company: '单',//单数的单位   没有则默认为 单
    orderPiece_dataIndex: 'inWarehouseSkuNum',//件数的索引  没有该字段则不展示该字段
    orderPiece_Company: '件',//件数的单位    没有则默认为 件
    icon: 'home_in'//icon的索引
  },
  {
    name: '今日出库',
    orderNumber_dataIndex: 'outWarehouseOrderNum',
    orderPiece_dataIndex: 'outWarehouseSkuNum',
    icon: 'home_out'
  },
  {
    name: '商品库存',
    orderNumber_dataIndex: 'skuStockNum',
    orderNumber_Company: '件',
    icon: 'home_repo'
  },
]