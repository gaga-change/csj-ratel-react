import React from 'react'
import { Table } from 'antd'
import BaseTitle from '@component/baseTitle/baseTitle'
const columns = [
  {
    align: 'center',
    title: '费用类型',
    dataIndex: 'palletType',
    width: 150,
    render: () => {
      return "订单处理费"
    }
  },
  {
    align: 'center',
    title: '计费方式',
    dataIndex: 'contractSortingRulesDO',
    width: 400,
    render: list => {
      if (!Array.isArray(list)) return ''
      return (list || []).map((v, i) => {
        let msg
        if (!v.endWeight) {
          msg = `${v.startWeight}公斤以上${!v.onePrice ? '，单价' + v.unitPrice : v.onePrice}元`
        } else {
          msg = `${v.endWeight}公斤以内${!v.onePrice ? '，单价' + v.unitPrice : v.onePrice}元`
        }
        return <div key={i}>
          {msg}
        </div>
      })
    }
  },
  {
    align: 'center',
    title: '数量',
    dataIndex: 'number',
    width: 150,
  },
  {
    align: 'center',
    title: '金额',
    dataIndex: 'price',
    render: text => <span className="red">{text || 0}元</span>
  },
];


const DisposalDetail = props => {
  const { result = {} } = props
  const { contactManagementVoList = [] } = result
  const dataSource = (contactManagementVoList || []).map((v, i) => ({ ...v, key: i }))

  return (
    <div className={props.className}>
      <BaseTitle>订单处理费明细</BaseTitle>
      <Table bordered dataSource={dataSource} columns={columns} size="small" pagination={false} />
    </div>
  )
}

export default DisposalDetail