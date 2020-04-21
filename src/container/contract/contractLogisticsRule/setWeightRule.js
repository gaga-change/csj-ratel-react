import React, { useState } from 'react'
import { Modal, InputNumber, Radio, Divider, message } from 'antd';
import "./setWeightRule.scss"
const setWeightRule = (props) => {

  const { visible, onClose, value = {
    config: [],
    price: undefined
  }, onSubmit } = props

  const [config, setConfig] = useState(() => value.config.map((v, i) => ({
    checkRange: v.endWeight ? 1 : 2,
    checkPrice: v.onePrice ? 1 : 2,
    endWeight: v.endWeight,
    unitPrice: v.unitPrice, // 单价 
    onePrice: v.onePrice, // 一口价
    key: i + '_' + Math.random(),
  })))

  const [price, setPrice] = useState(value.price)


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


  const handleOk = () => {
    // 必须有价格 范围必须已填写
    let lastItem = config[config.length - 1]
    if (lastItem.checkPrice === 1 && !lastItem.onePrice) {
      return message.error("请输入一口价");
    }
    if (lastItem.checkPrice === 2 && !lastItem.unitPrice) {
      return message.error("请输入单价");
    }
    if (lastItem.checkRange !== 2) {
      return message.error("配置不完整，最后一项区间结束必须为 ∞");
    }

    onSubmit && onSubmit({
      config: config.map((v, i) => ({
        startWeight: i === 0 ? 0 : config[i - 1].endWeight,
        endWeight: v.checkRange === 2 ? undefined : v.endWeight,
        unitPrice: v.checkPrice === 1 ? undefined : v.unitPrice,
        onePrice: v.checkPrice === 1 ? v.onePrice : undefined
      })),
      price
    })
    onClose && onClose()
  }

  const handleCancel = () => {
    onClose && onClose()
  }

  /** 删除规则 */
  const handleRemoveRule = () => {
    config.splice(config.length - 1, 1)
    setConfig([...config])
  }

  /** 价格修改 */
  const handleChangePrice = val => {
    setPrice(val)
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
  };
  return (
    <div>
      <Modal
        title="计费规则（重货）"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="SetWeightRuleModal">
          {
            config.map((item, i) => (
              <div key={item.key}>
                <div className="line-item">
                  <div className="left">
                    <Radio.Group disabled={i < config.length - 1}
                      onChange={val => changeCheckRange(val, item, config)}
                      value={item.checkRange}>
                      <Radio style={radioStyle} value={1}>
                        <span>（{i === 0 ? 0 : config[i - 1].endWeight},
                        <InputNumber disabled={i < config.length - 1} min={i === 0 ? 1 : (config[i - 1].endWeight + 1)} max={99999999} step={1} onChange={val => changeEndWeight(val, item, config)} value={item.endWeight} />】范围内</span>
                      </Radio>
                      <Radio style={radioStyle} value={2} className="mt5">
                        <span>（{i === 0 ? 0 : config[i - 1].endWeight}，∞）范围内</span>
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
                          <InputNumber disabled={i < config.length - 1} min={0} max={99999999} step={0.01} onChange={val => changeOnePrice(val, item, config)} value={item.onePrice} /> 元</span>
                      </Radio>
                      <Radio style={radioStyle} value={2} className="mt5">
                        <span>
                          <span className="label">单 价</span>
                          <InputNumber disabled={i < config.length - 1} min={0} max={99999999} step={0.01} onChange={val => changeUnitPrice(val, item, config)} value={item.unitPrice} /> 元</span>
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
            <span>
              <span>最低一票</span><InputNumber min={0} max={99999999} step={0.01} onChange={handleChangePrice} value={price} />元
            </span>
            <span style={{ float: 'right' }}>{
              config[config.length - 1].checkRange === 1 && <button className="btn-link" type="button" onClick={handleAddRule}>继续添加区间</button>
            }</span>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default setWeightRule