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
    key: 4
  }
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

export const contractTypeEnum = [
  {
    name: '运输快递合同',
    value: 0,
  },
  {
    name: '运输物流合同',
    value: 1,
  },
  {
    name: '仓储费合同',
    value: 2,
  },
  {
    name: '分拣处置费',
    value: 3,
  },
]


export const contractStatusEnum = [
  {
    name: '启用',
    value: 1,
  },
  {
    name: '禁用',
    value: 2,
  },
]

export const palletTypeEnum = [
  {
    name: '不加托',
    value: 1,
  },
  {
    name: '木托，60元',
    value: 2,
  },
  {
    name: '塑料托，80元',
    value: 3,
  },
]