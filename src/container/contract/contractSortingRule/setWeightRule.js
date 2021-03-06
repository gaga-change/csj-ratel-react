import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react'
import { InputNumber, Radio, Divider, message } from 'antd';
import "./setWeightRule.scss"
const setWeightRule = (props, ref) => {
  const { disabled } = props
  const [config, setConfig] = useState([])

  useEffect(() => {
    if (props.value) {
      setConfig(() => props.value.map((v, i) => ({
        checkRange: v.endWeight ? 1 : 2,
        checkPrice: v.onePrice ? 1 : 2,
        endWeight: v.endWeight,
        unitPrice: v.unitPrice, // 单价 
        onePrice: v.onePrice, // 一口价
        key: i + '_' + Math.random(),
      })))
    }
  }, [props.value])

  const createItem = () => ({
    key: Date.now(),
    checkRange: 1,
    checkPrice: 1,
    endWeight: config[config.length - 1] ? (config[config.length - 1].endWeight + 5) : 5,
    unitPrice: undefined, // 单价 
    onePrice: undefined, // 一口价
  })

  const changeCheckRange = (val, item, config) => {
    item.checkRange = val.target.value
    setConfig([...config])
  }
  const changeCheckPrice = (val, item, config) => {
    item.checkPrice = val.target.value
    setConfig([...config])
  }
  const changeEndWeight = (val, item, config) => {
    item.endWeight = val
    setConfig([...config])
  }
  const changeUnitPrice = (val, item, config) => {
    item.unitPrice = val
    setConfig([...config])
  }
  const changeOnePrice = (val, item, config) => {
    item.onePrice = val
    setConfig([...config])
  }

  if (config.length === 0) {
    config.push(createItem())
    setConfig([...config])
  }

  const submit = () => {
    // 必须有价格 范围必须已填写
    let lastItem = config[config.length - 1]
    if (lastItem.checkPrice === 1 && !lastItem.onePrice) {
      message.error("请输入一口价");
      return
    }
    if (lastItem.checkPrice === 2 && !lastItem.unitPrice) {
      message.error("请输入单价");
      return
    }
    if (lastItem.checkRange !== 2) {
      message.error("配置不完整，最后一项区间结束必须为 ∞");
      return
    }
    const temp = props.value || []
    return config.map((v, i) => ({
      id: temp[i] && temp[i].id,
      startWeight: i === 0 ? 0 : config[i - 1].endWeight,
      endWeight: v.checkRange === 2 ? undefined : v.endWeight,
      unitPrice: v.checkPrice === 1 ? undefined : v.unitPrice,
      onePrice: v.checkPrice === 1 ? v.onePrice : undefined
    }))
  }


  /** 删除规则 */
  const handleRemoveRule = () => {
    config.splice(config.length - 1, 1)
    setConfig([...config])
  }

  /** 添加区间 */
  const handleAddRule = () => {
    // 必须有价格 范围必须已填写
    let lastItem = config[config.length - 1]
    if (lastItem.checkPrice === 1 && !lastItem.onePrice) {
      return message.error("请输入一口价");
    }
    if (lastItem.checkPrice === 2 && !lastItem.unitPrice) {
      return message.error("请输入单价");
    }
    if (lastItem.checkRange === 1 && !lastItem.endWeight) {
      return message.error("请补全重量范围");
    }
    config.push(createItem())
    setConfig([...config])
  }

  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
  }


  useImperativeHandle(ref, () => ({
    submit: () => {
      return submit()
    }
  }));

  const ReadOnlyShow = (props) => {
    const { config = [] } = props
    return (
      <span>
        <span className="mr10">
          {config.map((v, i) => {
            let msg
            if (!v.endWeight) {
              msg = `${v.startWeight || ''}公斤以上${!v.onePrice ? '，单价' + (v.unitPrice || '') : (v.onePrice || '')}元`
            } else {
              msg = `${v.endWeight || ''}公斤以内${!v.onePrice ? '，单价' + (v.unitPrice || '') : (v.onePrice || '')}元`
            }
            return <div key={i}>
              {msg}
            </div>
          })}</span>
      </span>
    )
  }

  if (disabled) {
    return <ReadOnlyShow config={config} />
  }

  return (
    <div>
      <div className="SetWeightRuleModal">
        {
          (config || []).map((item, i) => (
            <div key={item.key}>
              <div className="line-item">
                <div className="left">
                  <Radio.Group disabled={i < config.length - 1}
                    onChange={val => changeCheckRange(val, item, config)}
                    value={item.checkRange}>
                    <Radio style={radioStyle} value={1}>
                      <span>（{i === 0 ? 0 : config[i - 1].endWeight},
                        <InputNumber disabled={i < config.length - 1} min={i === 0 ? 1 : (config[i - 1].endWeight + 1)} max={99999999} step={1} onChange={val => changeEndWeight(val, item, config)} value={item.endWeight} />】公斤范围内</span>
                    </Radio>
                    <Radio style={radioStyle} value={2} className="mt5">
                      <span>（{i === 0 ? 0 : config[i - 1].endWeight}，∞）公斤范围内</span>
                    </Radio>
                  </Radio.Group>
                </div>
                <div className="right">
                  <Radio.Group disabled={i < config.length - 1}
                    onChange={val => changeCheckPrice(val, item, config)}
                    value={item.checkPrice}>
                    <Radio style={radioStyle} value={1}>
                      <span>
                        <span className="label">一口价 </span>
                        <InputNumber disabled={i < config.length - 1} min={0} max={99999999} step={1} precision={2} onChange={val => changeOnePrice(val, item, config)} value={item.onePrice} /> 元</span>
                    </Radio>
                    <Radio style={radioStyle} value={2} className="mt5">
                      <span>
                        <span className="label">单 价</span>
                        <InputNumber disabled={i < config.length - 1} min={0} max={99999999} step={1} precision={2} onChange={val => changeUnitPrice(val, item, config)} value={item.unitPrice} /> 元</span>
                    </Radio>
                  </Radio.Group>
                </div>
                <span className="controller-btns">
                  {i === config.length - 1 && i !== 0 && <button className="btn-link" onClick={handleRemoveRule} type="button">删 除</button>}

                </span>
              </div>
              <Divider />

            </div>

          ))
        }

        <div>
          <span style={{ float: 'left' }}>{
            config[config.length - 1].checkRange === 1 && <button className="btn-link" type="button" onClick={handleAddRule}>继续添加区间</button>
          }
          </span>
        </div>
      </div>
    </div>
  )
}

export default forwardRef(setWeightRule)