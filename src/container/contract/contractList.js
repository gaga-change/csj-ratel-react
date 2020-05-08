import React, { useRef, useEffect, useState } from 'react'
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
  const urlChange = useRef(null)
  const [initialValues] = useState(() => {
    const match = /\?contractType=(\d)/g.exec(props.location.search)
    if (match) {
      return { contractType: Number(match[1]) }
    } else {
      return {}
    }
  })

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
          <Button data-rule-id="contract-delete" type="link" onClick={() => handleDel(row)}>删除</Button>
          <Button data-rule-id="contract-modify" type="link" onClick={() => handleDetail(row)}>修改</Button>
          {/* <Button type="link" onClick={() => handleDetail(row, true)}>查看</Button> */}
        </span>)
      }
    },
  ]

  useEffect(() => {
    if (urlChange.current === null) {
      // console.log('第一次进入')
    } else if (urlChange.current === props.location.search) {
      // console.log('路由无变化')
    } else {
      // console.log('url改变')
      const match = /\?contractType=(\d)/g.exec(props.location.search)
      // console.log(match)
      if (match) {
        // 重置表单， 但类型初始有值
        baseList.current.baseSearch.current.form.resetFields()
        baseList.current.baseSearch.current.form.setFieldsValue({ contractType: Number(match[1]) })
        baseList.current.baseSearch.current.form.submit()
      } else {
        // 重置表单
        baseList.current.baseSearch.current.form.resetFields()
        baseList.current.baseSearch.current.form.setFieldsValue({ contractType: undefined })
        baseList.current.baseSearch.current.form.submit()
      }
    }
    urlChange.current = props.location.search
  }, [props.location])

  return (<div>
    <BaseList
      ref={baseList}
      vertical={true}
      searchConfig={searchConfig}
      initialValues={initialValues}
      api={getContractListByPage}
      tableConfig={tableConfig}
      rowKey="id"
    >
      <div className="fr">
        <Button data-rule-id="contract-create-contractExpress" type="primary" onClick={() => props.history.push('/sys/contract/contractExpress')}>新建快递</Button>
        <Button data-rule-id="contract-create-contractStore" className="ml10" type="primary" onClick={() => props.history.push('/sys/contract/contractStore')}>新建仓储</Button>
        <Button data-rule-id="contract-create-contractLogistics" className="ml10" type="primary" onClick={() => props.history.push('/sys/contract/contractLogistics')}>新建物流</Button>
        <Button data-rule-id="contract-create-contractSorting" className="ml10" type="primary" onClick={() => props.history.push('/sys/contract/contractSorting')}>新建处置</Button>
      </div>
    </BaseList>

  </div>)
}
export default ContractList