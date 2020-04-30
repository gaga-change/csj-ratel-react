import React from 'react'
import { Table } from 'antd'
const columns = [
  {
    title: '费用类型',
    dataIndex: 'palletType',
    render: () => {
      return "订单处理费"
    }
  },
  {
    title: '计费方式',
    dataIndex: 'contractSortingRulesDO',
    width: 300,
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
    title: '数量',
    dataIndex: 'number',
  },
  {
    title: '金额',
    dataIndex: 'price',
    render: text => <span className="red">{text}</span>
  },
];


const DisposalDetail = props => {
  const { result = {} } = props
  const { contactManagementVoList = [] } = result
  const dataSource = (contactManagementVoList || []).map((v, i) => ({ ...v, key: i }))

  return (
    <div className={props.className}>
      <h4>订单处理费明细</h4>
      <Table dataSource={dataSource} columns={columns} size="small" />
    </div>
  )
}

export default DisposalDetail