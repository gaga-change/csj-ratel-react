import React from 'react'
import BaseList from '@component/BaseList'
import { customerList } from 'api'

const tableConfig = [
  { label: '客户编码', prop: 'customerCode' },
  { label: '客户名称', prop: 'customerName' }
]
const searchConfig = [
  { label: '客户编码', prop: 'customerCode' },
  { label: '客户名称', prop: 'customerName' }
]
const ContractList = props => {
  const handleTableSelect = () => {

  }
  return (<div>
    <BaseList vertical={false}
      searchConfig={searchConfig}
      api={customerList}
      tableConfig={tableConfig}
      rowKey="id"
    />

  </div>)
}
export default ContractList