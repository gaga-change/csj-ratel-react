import React, { useRef } from 'react'
import BaseList from '@component/BaseList'
import { getContractListByPage, deleteContract } from 'api'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Modal, message } from 'antd'

const { confirm } = Modal;

const searchConfig = [
  { label: '合同类型', prop: 'contractType', type: 'enum', enum: 'contractTypeEnum' },
  { label: '有效起始日期', prop: 'contractStartDate', type: 'time', format: 'YYYY-MM-DD' },
  { label: '有效截止日期', prop: 'contractEndDate', type: 'time', format: 'YYYY-MM-DD' },
  { label: '合同状态', prop: 'contractStatus', type: 'enum', enum: 'contractStatusEnum' },
  { label: '登记人', prop: 'createrName' },
]

const ContractList = props => {
  const baseList = useRef()
  const handleDel = row => {
    confirm({
      title: '是否要删除该合同？',
      icon: <ExclamationCircleOutlined />,
      content: `合同编号：${row.contractCode}`,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      confirmLoading: true,
      onOk() {
        return new Promise((r, j) => {
          deleteContract(row.contractCode).then(res => {
            if (!res) {
              j()
            } else {
              r()
              message.success("操作成功！")
              baseList.current.fetch()
            }
          })
        })
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  const handleDetail = (row, readOnly = '') => {
    switch (row.contractType) {
      case 0:
        props.history.push(`/sys/contract/contractExpress?id=${row.id}&readOnly=${readOnly}`)
        break
      case 1:
        props.history.push(`/sys/contract/contractLogistics?id=${row.id}&readOnly=${readOnly}`)
        break
      case 2:
        props.history.push(`/sys/contract/contractStore?id=${row.id}&readOnly=${readOnly}`)
        break
      case 3:
        props.history.push(`/sys/contract/contractSorting?id=${row.id}&readOnly=${readOnly}`)
        break
      default:

    }
  }

  const tableConfig = [
    { label: '序号', prop: '_index' },
    { label: '货主', prop: 'ownerName' },
    {
      label: '合同编号', prop: 'contractCode', render: (text, row) => {
        return (
          <Button type="link" onClick={() => handleDetail(row, true)}>{text}</Button>
        )
      }
    },
    { label: '合同号', prop: 'contractNo' },
    { label: '合同类型', prop: 'contractType', type: 'enum', enum: 'contractTypeEnum' },
    { label: '有效起始日期', prop: 'contractStartDate', type: 'time', format: 'YYYY-MM-DD' },
    { label: '有效截止日期', prop: 'contractEndDate', type: 'time', format: 'YYYY-MM-DD' },
    { label: '合同状态', prop: 'contractStatus', type: 'enum', enum: 'contractStatusEnum' },
    { label: '登记人', prop: 'createrName' },
    {
      label: '操作', prop: 'id', render: (id, row) => {
        return (<span>
          <Button type="link" onClick={() => handleDel(row)}>删除</Button>
          <Button type="link" onClick={() => handleDetail(row)}>修改</Button>
          {/* <Button type="link" onClick={() => handleDetail(row, true)}>查看</Button> */}
        </span>)
      }
    },
  ]

  return (<div>
    <BaseList
      ref={baseList}
      vertical={true}
      searchConfig={searchConfig}
      api={getContractListByPage}
      tableConfig={tableConfig}
      rowKey="id"
    />

  </div>)
}
export default ContractList