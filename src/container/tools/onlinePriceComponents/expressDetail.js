import React from 'react'
import { Table } from 'antd'

const columns = [
  {
    title: '运输方式',
    dataIndex: 'transportType',
    render: text => {
      let res = null;
      switch (Number(text)) {
        case 0:
          res = (<span>快递</span>)
          break
        case 1:
          res = (<span>物流</span>)
          break
        default:
          res = (<span></span>)
      }
      return res
    }
  },
  {
    title: '计价方式',
    dataIndex: 'contractTemplateRuleVoList',
    width: 300,
    render: list => {
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
    title: '物流费',
    dataIndex: 'logisticsFee',
    render: text => (<span>预估运费总价：<span className="red">{text || 0}</span> 元</span>)
  },
]

const ShowPrice = props => {
  const { result = {} } = props
  const { transportType, contractTemplateRuleVoList = [], logisticsFee } = result

  const dataSource = []
  if (contractTemplateRuleVoList && contractTemplateRuleVoList.length) {
    dataSource.push({
      transportType,
      contractTemplateRuleVoList,
      logisticsFee,
      key: 1,
    })
  }
  return (
    <div className={props.className}>
      <h4>运输费明细</h4>
      <Table dataSource={dataSource} columns={columns} size="small" />
    </div>
  )
}

export default ShowPrice