import React from 'react'
import { Divider } from 'antd'
const redStyle = {
  color: 'red'
}
const ShowPrice = props => {
  const { planOutAmt = '' } = props
  return (
    <div className="f18">
      <span className="mr25"> 商品总价 ：<span style={redStyle}>{planOutAmt}</span> 元</span>
      <span className="mr25"> 运输费 ：<span style={redStyle}>238</span> 元</span>
      <span className="mr25"> 处置费 ：<span style={redStyle}>238</span> 元</span>
      <Divider type="vertical" />
      <span className="ml25"> 总金额 ：<span style={redStyle}>238</span> 元</span>
    </div>
  )
}

export default ShowPrice