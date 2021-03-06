import React, { useState } from 'react'
import { Modal, Checkbox } from 'antd';
import { Area } from '@lib/area2'
const options = Area
const selectAddress = (props) => {
  const { visible, onClose, value = [], onSubmit } = props
  const [checkedValues, setCheckedValues] = useState([...value])

  const handleOk = () => {
    onSubmit && onSubmit(checkedValues)
    onClose && onClose()
  }

  const handleCancel = () => {
    onClose && onClose()
  }
  const onChange = checkedValues => {
    setCheckedValues(checkedValues)
  }
  return (
    <div>
      <Modal
        title="请选择目的地"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Checkbox.Group options={options} defaultValue={value} onChange={onChange} />
      </Modal>
    </div>
  )
}

export default selectAddress