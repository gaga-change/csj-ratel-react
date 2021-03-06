


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
    title: '出库数量',
    dataIndex: 'skuOutQty',
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
    dataIndex: 'outStorePrice',
  },
  {
    title: '计划出库量',
    dataIndex: 'skuOutQty',
  },
  {
    title: '已出库量',
    dataIndex: 'realOutQty',
  }
]


export const BaseCard_Config = [
  {
    title: '业务单编号',
    dataIndex: 'busiBillNo',
  },
  {
    title: '计划出库日期',
    dataIndex: 'arrivalPreDate',
    type: 'time'
  },
  {
    title: '出库仓库',
    dataIndex: 'warehouseName',
  },
  {
    title: '计划出库总量',
    dataIndex: 'planOutQty',
  },
  {
    title: '客户编码',
    dataIndex: 'arrivalCode',
  },
  {
    title: '客户名称',
    dataIndex: 'arrivalName',
  },
  {
    title: '备注',
    dataIndex: 'remarkInfo',
  },
  {
    title: '创建人',
    dataIndex: 'busiBillCreater',
  },
  {
    title: '创建日期',
    dataIndex: 'busiBillCreateTime',
    type: 'time'
  },
  {
    title: '状态',
    dataIndex: 'billStatus',
    useLocalEnum: 'billStatusEnum'
  },
  {
    title: '详细地址',
    dataIndex: 'arrivalAddress',
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
    dataIndex: 'realOutQty'
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