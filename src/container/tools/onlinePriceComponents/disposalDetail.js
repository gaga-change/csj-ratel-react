import React from 'react'
import { Table } from 'antd'

const dataSource = [

];

const columns = [
  {
    title: '费用类型',
    dataIndex: 'aaa',
    key: 'name',
  },
  {
    title: '计费方式',
    dataIndex: 'bbb',
    key: 'age',
  },
  {
    title: '数量',
    dataIndex: 'ccc',
    key: 'address',
  },
  {
    title: '金额',
    dataIndex: 'ddd',
    key: 'ddd',
  },
];


const DisposalDetail = props => {
  const { inited } = props
  return (
    <div className={props.className}>
      <h4>处置费明细</h4>
      {inited && <Table dataSource={dataSource} columns={columns} size="small" />}
    </div>
  )
}

export default DisposalDetail