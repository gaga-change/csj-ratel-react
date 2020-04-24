import React from 'react'
import { Table } from 'antd'

const dataSource = [

];

const columns = [
  {
    title: '运输方式',
    dataIndex: 'aaa',
    key: 'name',
  },
  {
    title: '计价方式',
    dataIndex: 'bbb',
    key: 'age',
  },
  {
    title: '物流费',
    dataIndex: 'ccc',
    key: 'address',
  },
]

const ShowPrice = props => {
  const { inited } = props
  return (
    <div className={props.className}>
      <h4>运输费明细</h4>
      {inited && <Table dataSource={dataSource} columns={columns} size="small" />}

    </div>
  )
}

export default ShowPrice