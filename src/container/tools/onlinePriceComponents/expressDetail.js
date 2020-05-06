import React from 'react'
import { Table } from 'antd'
import BaseTitle from '@component/baseTitle/baseTitle'

const columns = [
  {
    align: 'center',
    title: '运输方式',
    dataIndex: 'transportType',
    width: 150,
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
    align: 'center',
    title: '计价方式',
    dataIndex: 'contractTemplateRuleVoList',
    width: 400,
    render: (list, row) => {
      return (
        <div>
          {(list || []).map((v, i) => {
            let msg
            if (!v.endWeight) {
              msg = `${v.startWeight}公斤以上${!v.onePrice ? '，单价' + v.unitPrice : v.onePrice}元`
            } else {
              msg = `${v.endWeight}公斤以内${!v.onePrice ? '，单价' + v.unitPrice : v.onePrice}元`
            }
            return <div key={i}>
              {msg}
            </div>
          })}
          {row.lowPrice && <div>最低一票{row.lowPrice}元</div>}
        </div>
      )
    }
  },
  {
    align: 'center',
    title: '数量',
    dataIndex: 'transportNumber',
    width: 150,
  },
  {
    align: 'center',
    title: '物流费',
    dataIndex: 'logisticsFee',
    render: text => (<span>预估运费总价：<span className="red">{text || 0}</span> 元</span>)
  },
]

const ShowPrice = props => {
  const { result = {} } = props
  const { transportType, contractTemplateRuleVoList = [], logisticsFee, lowPrice, transportNumber } = result

  const dataSource = []
  if (contractTemplateRuleVoList && contractTemplateRuleVoList.length) {
    dataSource.push({
      lowPrice,
      transportType,
      contractTemplateRuleVoList,
      logisticsFee,
      key: 1,
      transportNumber,
    })
  }
  return (
    <div className={props.className}>
      <BaseTitle>运输费明细</BaseTitle>
      <Table bordered dataSource={dataSource} columns={columns} size="small" pagination={false} />
    </div>
  )
}

export default ShowPrice