//单据状态(入库,)
export const warehousing_planStateEnum = [
  {
    value: '草稿',
    key: 0
  },
  {
    value: '待审核',
    key: 1
  },
  {
    value: '审核通过',
    key: 2
  },
  {
    value: '审核不通过(驳回)',
    key: 3
  },
  {
    value: '取消',
    key: 4
  },
  {
    value: '部分执行',
    key: 5
  },
  {
    value: '执行完成',
    key: 6
  },
  {
    value: '已关闭',
    key: 7
  },
]

//单据状态（新）
export const billStatusEnum = [
  {
    value: '草稿',
    key: 0
  },
  {
    value: '已审核',
    key: 1
  },
  {
    value: '驳回',
    key: 2
  },
  {
    value: '已关闭',
    key: 3
  }
]

//单据状态(出库,)
export const outgoing_planStateEnum = [
  {
    value: '草稿',
    key: 0
  },
  {
    value: '待审核',
    key: 1
  },
  {
    value: '审核通过',
    key: 2
  },
  {
    value: '审核不通过(驳回)',
    key: 3
  },
  {
    value: '取消',
    key: 4
  },
  {
    value: '部分执行',
    key: 5
  },
  {
    value: '执行完成',
    key: 6
  },
  {
    value: '已关闭',
    key: 7
  },
]

/** 销售区分 */
export const saleTypeEnum = [
  {
    name: '常备',
    value: 1
  },
  {
    name: '非常备',
    value: 2
  },
  {
    name: '不区分',
    value: 3
  }
]

export const ruleTypeEnum = [
  {
    name: '菜单',
    value: 0,
  },
  {
    name: '按钮',
    value: 1,
  },
  {
    name: '外部连接',
    value: 2,
  },

]