import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'

import { Table } from 'antd';
import SelectAddress from './selectAddress'
import SetWeightRule from './setWeightRule'
import { getCityByCode } from '@lib/area2'


const contractLogisticsRule = (props, ref) => {
  const { disabled } = props

  const [data, setData] = useState([])
  const [addressVisible, setAddressVisible] = useState(false)
  const [weightRuleVisible, setWeightRuleVisible] = useState(false)
  const [throwRuleVisible, setThrowRuleVisible] = useState(false)
  const [row, setRow] = useState({})

  useEffect(() => {
    setData((props.value || []).map((v, i) => ({
      endPlaceList: v.endPlaceList,
      weightRule: {
        config: v.heavyRuleDetailReqList,
        price: v.heavyLowPrice
      },
      throwRule: {
        config: v.lightRuleDetailReqList,
        price: v.lightLowPrice,
      },
      key: i + '_' + Math.random()
    })))
  }, [props.value])

  const submit = () => {
    const { value = [] } = props
    return data.map((v, i) => ({
      groupId: value[i] && value[i].groupId,
      endPlaceList: v.endPlaceList,
      heavyRuleDetailReqList: v.weightRule.config,
      heavyLowPrice: v.weightRule.price,
      lightRuleDetailReqList: v.throwRule.config,
      lightLowPrice: v.throwRule.price,
    }))
  }

  useImperativeHandle(ref, () => ({
    submit: () => {
      return submit()
    }
  }));

  const createDataItem = () => ({ endPlaceList: [], weightRule: { config: [], price: undefined }, throwRule: { config: [], price: undefined }, key: Date.now() })

  /** 编辑出发地 按钮点击 */
  const handleModifyAddress = (list, record) => {
    setRow(record)
    setAddressVisible(true)
  }

  /** 编辑 重货规则 */
  const handleModifyWeightRule = (text, row) => {
    setRow(row)
    setWeightRuleVisible(true)
  }

  /** 编辑 抛货规则 */
  const handleModifyThrowRule = (text, row) => {
    setRow(row)
    setThrowRuleVisible(true)
  }

  /** 地址编辑结束 */
  const handleAddressChange = (values) => {
    row.endPlaceList = values
    setData([...data])
    setRow(null)
  }

  /** 规则配置结束 重货 */
  const handleWeightRuleChange = (weightRule) => {
    row.weightRule = weightRule
    setData([...data])
    setRow(null)
  }
  /** 规则配置结束 抛货 */
  const handleThrowRuleChange = (throwRule) => {
    row.throwRule = throwRule
    setData([...data])
    setRow(null)
  }

  /** 添加规则按钮点击 */
  const handleAddRule = () => {
    data.push(createDataItem())
    setData([...data])
  }


  /** 删除某行规则 */
  const handelDelRow = i => {
    data.splice(i, 1)
    setData([...data])
  }


  const columns = [
    {
      title: '目的地',
      dataIndex: 'endPlaceList',
      key: 'endPlaceList',
      render: (list, record) => {
        return (
          <span>
            <span className="mr10">{list.map(v => {
              return getCityByCode(v.split('_')[1])
            }).join(',')}</span>
            {!disabled && <button className="btn-link" onClick={() => handleModifyAddress(list, record)} type="button">编辑</button>}
          </span>
        )
      },
    },
    {
      title: '计费规则（重货）',
      dataIndex: 'weightRule',
      key: 'weightRule',
      width: 200,
      render: (weightRule, record) => {
        return (
          <span>
            <span className="mr10">{weightRule.config.map((v, i) => {
              let msg
              if (!v.endWeight) {
                msg = `${v.startWeight}公斤以上${!v.onePrice ? '，单价' + v.unitPrice : v.onePrice}元`
              } else {
                msg = `${v.endWeight}公斤以内${!v.onePrice ? '，单价' + v.unitPrice : v.onePrice}元`
              }
              return <div key={i}>
                {msg}
              </div>
            })}{weightRule.price && <div>最低一票{weightRule.price}元</div>}</span>
            {!disabled && <button className="btn-link" onClick={() => handleModifyWeightRule(weightRule, record)} type="button">编辑</button>}
          </span>
        )
      },
    },
    {
      title: '计费规则（抛货）',
      dataIndex: 'throwRule',
      key: 'throwRule',
      width: 200,
      render: (throwRule, record) => {
        return (
          <span>
            <span className="mr10">{throwRule.config.map((v, i) => {
              let msg
              if (!v.endWeight) {
                msg = `${v.startWeight}方以上${!v.onePrice ? '，单价' + v.unitPrice : v.onePrice}元`
              } else {
                msg = `${v.endWeight}方以内${!v.onePrice ? '，单价' + v.unitPrice : v.onePrice}元`
              }
              return <div key={i}>
                {msg}
              </div>
            })}{throwRule.price && <div>最低一票{throwRule.price}元</div>}</span>
            {!disabled && <button className="btn-link" onClick={() => handleModifyThrowRule(throwRule, record)} type="button">编辑</button>}
          </span>
        )
      },
    },
  ]

  if (!disabled) {
    columns.push({
      title: '操作',
      key: 'action',
      width: 100,
      render: (text, record, i) => (
        <span>
          <button className="btn-link" onClick={() => handelDelRow(i)} type="button">删除</button>
        </span>
      ),
    })
  }

  return (
    <div>
      <Table columns={columns} dataSource={data} pagination={false} />,
      <div>
        {!disabled && <button className="btn-link" onClick={handleAddRule} type="button">增加目的地运费</button>}
      </div>
      {
        addressVisible && <SelectAddress visible={addressVisible} value={row.endPlaceList} onClose={() => setAddressVisible(false)} onSubmit={handleAddressChange} />
      }
      {
        weightRuleVisible && <SetWeightRule visible={weightRuleVisible} typeName="重货" value={row.weightRule} onClose={() => setWeightRuleVisible(false)} onSubmit={handleWeightRuleChange} />
      }
      {
        throwRuleVisible && <SetWeightRule visible={throwRuleVisible} typeName="抛货" value={row.throwRule} onClose={() => setThrowRuleVisible(false)} onSubmit={handleThrowRuleChange} />
      }
    </div>
  )
}

export default forwardRef(contractLogisticsRule)