import React from 'react'
import BaseList from '@component/BaseList'
import { getContractListByPage } from 'api'

const tableConfig = [
  { label: '序号', prop: '_index' },
  { label: '货主', prop: 'ownerName' },
  { label: '合同编号', prop: 'contractCode' },
  { label: '合同号', prop: 'contractNo' },
  { label: '合同类型', prop: 'contractType', type: 'enum', enum: 'contractTypeEnum' },
  { label: '有效起始日期', prop: 'contractStartDate', type: 'time', format: 'YYYY-MM-DD' },
  { label: '有效截止日期', prop: 'contractEndDate', type: 'time', format: 'YYYY-MM-DD' },
  { label: '合同状态', prop: 'contractStatus', type: 'enum', enum: 'contractStatusEnum' },
  { label: '登记人', prop: 'createrName' },
]
const searchConfig = [
  { label: '客户编码', prop: 'customerCode' },
  { label: '客户名称', prop: 'customerName' }
]
const ContractList = props => {

  return (<div>
    <BaseList vertical={false}
      searchConfig={searchConfig}
      api={getContractListByPage}
      tableConfig={tableConfig}
      rowKey="id"
    />

  </div>)
}
export default ContractList