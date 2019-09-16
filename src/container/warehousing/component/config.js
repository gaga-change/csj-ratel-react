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
    dataIndex: 'inPrice',
  },
  {
    title: '计划入库数量',
    dataIndex: 'skuInQty',
  },
  {
    title: '已入库总量',
    dataIndex: 'realInQty',
  },

]

export const formTable_config = [
  {
    title: '序号',
    dataIndex: 'index',
  },
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
  },
  {
    title: '入库数量',
    dataIndex: 'planInQty',
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
    dataIndex: 'skuUnitCode',
  },
  {
    title: '单价(成本)',
    dataIndex: 'inPrice',
  },
  {
    title: '计划入库量',
    dataIndex: 'planInQty',
  },
  {
    title: '已入库量',
    dataIndex: 'realInQty',
    render: '',
  }
]


export const BaseCard_Config = [
  {
    title: '业务单编号',
    dataIndex: 'planCode',
  },
  {
    title: '计划入库日期',
    dataIndex: 'planTime',
    type: 'time'
  },
  {
    title: '入库仓库',
    dataIndex: 'planWarehouseName',
  },
  {
    title: '计划入库总量',
    dataIndex: 'inPlanQty',
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
    useLocalEnum: 'warehousing_planStateEnum'
  },

]


export const PopoverTable_Config = [
  {
    title: '序号',
    dataIndex: 'index',
  },
  {
    title: '入库单号',
    dataIndex: 'warehouseExeCode',
  },
  {
    title: '入库时间',
    dataIndex: 'inWarehouseTime',
    type: 'time'
  },
  {
    title: '入库数量',
    dataIndex: 'inQty'
  },
  {
    title: '入库金额',
    dataIndex: 'inAmt'
  }
]





//入库
export const map_Config = {
  'busiIndex': 'index',
  'inPrice': 'purchasePrice',
  'skuBrandName': 'brandName',
  'skuModel': 'skuFormat',
  'skuCategoryName': 'categoryName',
  'skuUnitName': 'largePackUnitName'
}