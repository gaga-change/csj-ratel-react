import React from 'react'
import { Divider } from 'antd'
const redStyle = {
  color: 'red'
}
const ShowPrice = props => {
  const { result = {} } = props
  const { goodsTotalPrice, transportPrice, managementPrice, totalPrice } = result
  return (
    <div className="f18">
      {goodsTotalPrice !== null && <span className="mr25"> 商品总价 ：<span style={redStyle}>{goodsTotalPrice || 0}</span> 元</span>}
      {transportPrice !== null && <span className="mr25"> 运输费 ：<span style={redStyle}>{transportPrice || 0}</span> 元</span>}
      {managementPrice !== null && <span className="mr25"> 处置费 ：<span style={redStyle}>{managementPrice || 0}</span> 元</span>}
      {totalPrice !== null && <Divider type="vertical" />}
      {totalPrice !== null && <span className="ml25"> 总金额 ：<span style={redStyle}>{totalPrice || 0}</span> 元</span>}
    </div>
  )
}

export default ShowPrice