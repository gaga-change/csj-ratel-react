import React, { useState, useEffect } from 'react'
import { Checkbox, Drawer } from 'antd';
import _ from 'lodash'
import { Area } from '@lib/area2'
import "./selectAddress.scss"

const CheckboxGroup = Checkbox.Group;

const ShengCheckBoxArea = props => {

  const { value = [], options, onChange } = props

  const [checkedList, setCheckedList] = useState([...value])
  const [indeterminate, setIndeterminate] = useState(false)
  const [checkAll, setCheckAll] = useState(false)

  const handleChange = checkedList => {
    setCheckedList(checkedList)
    setIndeterminate(!!checkedList.length && checkedList.length < options.children.length)
    setCheckAll(checkedList.length === options.children.length)
  }

  const onCheckAllChange = e => {
    setCheckedList(e.target.checked ? options.children.map(v => v.value) : [])
    setIndeterminate(false)
    setCheckAll(e.target.checked)
  };

  useEffect(() => {
    onChange && onChange(checkedList)
  }, [checkedList])


  return (
    <div className="mb20">
      {options.children.length > 1 && <div className="site-checkbox-all-wrapper">
        <Checkbox
          indeterminate={indeterminate}
          onChange={onCheckAllChange}
          checked={checkAll}
        >
          {options.label}
        </Checkbox>
      </div>}
      <CheckboxGroup
        options={options.children}
        value={checkedList}
        onChange={handleChange}
      />
    </div>
  )
}

const selectAddress = (props) => {
  const { visible, onClose, value = [], onSubmit } = props
  let map = {}
  value.forEach(v => {
    let temp = v.split('_')
    map[temp[0]] = map[temp[0]] || []
    map[temp[0]].push(temp[1])
  })

  const area = _.cloneDeep(Area).map(v => ({ ...v, checked: map[v.value] || [] }))
  const [options, setOptions] = useState(area)

  const handleCancel = () => {
    const checks = options.reduce((arr, item) => {
      arr.push(...item.checked.map(v => `${item.value}_${v}`))
      return arr
    }, [])
    onSubmit && onSubmit(checks)
    onClose && onClose()
  }

  const onChange = (fa, sons) => {
    fa.checked = sons
    setOptions([...options])
  }

  return (
    <div>
      <Drawer
        title="选择地区"
        width={'60%'}
        placement="right"
        closable={false}
        onClose={handleCancel}
        visible={visible}
      >
        {
          options.map(v => (
            <ShengCheckBoxArea options={v} key={v.value} value={v.checked} onChange={val => onChange(v, val)} />
          ))
        }
      </Drawer>
    </div>
  )
}

export default selectAddress