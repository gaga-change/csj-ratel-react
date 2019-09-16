


export const indexTableColumns_ChildConfig = [
  {
    title: '商品编码',
    dataIndex: 'skuCode',
  },
  {
    title: '商品名称',
    dataIndex: 'skuName',
  },
  {
    title: '单价',
    dataIndex: 'outStorePrice',
  },
  {
    title: '计划出库数量',
    dataIndex: 'skuOutQty',
  },
  {
    title: '已出库总量',
    dataIndex: 'realOutQty',
  },

]

export const formTable_config = [
  {
    title: '序号',
    dataIndex: 'index',
    width: 40
  },
  {
    title: '商品编号',
    dataIndex: 'skuCode',
  },
  {
    title: '商品名称',
    dataIndex: 'skuName',
    width: 80
  },
  {
    title: '品牌',
    dataIndex: 'brandName',
    width: 80
  },
  {
    title: '规格型号',
    dataIndex: 'skuFormat',
  },
  {
    title: '单位',
    dataIndex: 'skuUnitName',
  },
  {
    title: '仓库',
    dataIndex: 'warehouseName',
    width: 80
  },
  {
    title: '出库数量',
    dataIndex: 'planOutQty',
    editable: true,
    editing: 'true',
    rules: [
      {
        required: true,
        validator: (rule, value, callback) => {
          if (isNaN(value)) {
            callback('不能为空且要为数字')
          } else if (value <= 0) {
            callback('数量必须大于0')
          } else {
            callback()
          }
        }
      }
    ],
    inputType: 'InputNumber',
    width: 120,
  },
  {
    title: '操作',
    dataIndex: '',
    render: '',
    width: 100,
  },

]


export const goodsInStorage_config = [

  {
    title: '货主商品编码',
    dataIndex: 'ownerSkuCode',
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
    dataIndex: 'skuUnitName',
  },
  {
    title: '可用库存',
    dataIndex: 'skuQty',
    render: (v, record) => record.skuQty - record.lockQty
  },
]


export const warehousingDetail_Config = [
  {
    title: '序号',
    dataIndex: 'index',
  },
  {
    title: '商品编码',
    dataIndex: 'skuCode',
  },
  {
    title: '商品名称',
    dataIndex: 'skuName',
  },
  {
    title: '品牌',
    dataIndex: 'skuBrandName',
  },
  {
    title: '规格型号',
    dataIndex: 'skuFormat',
  },
  {
    title: '单位',
    dataIndex: 'skuUnitName',
  },
  {
    title: '单价(销售价)',
    dataIndex: 'outPrice',
  },
  {
    title: '计划出库量',
    dataIndex: 'planOutQty',
  },
  {
    title: '已出库量',
    dataIndex: 'realOutQty',
    render: ''
  }
]


export const BaseCard_Config = [
  {
    title: '业务单编号',
    dataIndex: 'planCode',
  },
  {
    title: '计划出库日期',
    dataIndex: 'planOutTime',
    type: 'time'
  },
  {
    title: '出库仓库',
    dataIndex: 'planWarehouseName',
  },
  {
    title: '计划出库总量',
    dataIndex: 'outPlanQty',
  },
  {
    title: '创建人',
    dataIndex: 'createrName',
  },
  {
    title: '创建日期',
    dataIndex: 'gmtCreate',
    type: 'time'
  },
  {
    title: '状态',
    dataIndex: 'planState',
    useLocalEnum: 'outgoing_planStateEnum'
  },

]

export const PopoverTable_Config = [
  {
    title: '序号',
    dataIndex: 'index',
  },
  {
    title: '出库单号',
    dataIndex: 'warehouseExeCode',
  },
  {
    title: '出库时间',
    dataIndex: 'outStoreTime',
    type: 'time'
  },
  {
    title: '出库数量',
    dataIndex: 'outQty'
  },
  {
    title: '出库金额',
    dataIndex: 'outAmt'
  }
]


//出库
export const map_Config = {
  'busiIndex': 'index',
  'skuBrandCode': 'brandCode',
  'outPrice': 'sellPrice',
  'skuBrandName': 'brandName',
  'skuModel': 'skuFormat',
  'productFactory': 'factoryName',
}