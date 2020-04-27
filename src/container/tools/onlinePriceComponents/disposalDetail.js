import React from 'react'
import { Table } from 'antd'
import { palletTypeEnum } from '@lib/enum'
const columns = [
  {
    title: '费用类型',
    dataIndex: 'palletType',
    render: (text) => {
      let temp = palletTypeEnum.find(v => Number(v.value) === text)
      return temp && temp.name
    }
  },
  {
    title: '计费方式',
    dataIndex: 'type',
    render: (text, row) => {
      let res = null
      switch (Number(row.palletType)) {
        case 2:
          res = (<span>60元/个</span>)
          break
        case 3:
          res = (<span>80元/个</span>)
          break
        default:
          res = (<span>无</span>)
      }
      return res
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
      <h4>处置费明细</h4>
      <Table dataSource={dataSource} columns={columns} size="small" />
    </div>
  )
}

export default DisposalDetail