import React from 'react'

const UnitInput = props => {
  const temp = { ...props }
  delete temp.unit
  return (<div style={{ display: 'flex', alignItems: 'center' }}>
    {React.cloneElement(React.Children.only(props.children), { ...temp })}
    <span className="ml10">{props.unit}</span>
  </div>)
}

export default UnitInput