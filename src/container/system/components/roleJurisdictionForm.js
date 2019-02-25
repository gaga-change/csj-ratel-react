import React from 'react';
import {
  Checkbox
} from 'antd';
import '../style/modifyPasswordForm.scss';
import jurisdictionList from '../config/jurisdiction.js'

jurisdictionList.forEach(item => {
  item.options = []
  item.checkedList = []
  item.indeterminate = false
  item.checkAll = false
  item.list.forEach(son => {
    item.options.push(son.name)
  })
})

const CheckboxGroup = Checkbox.Group;

/**
 * props:
 *  goSubmit<Boolean> 是否进行表单提交操作。如果 false->true 则会提交表单
 *  onSubmited<Function> 表单提交结束。通知父组件将goSubmit修改为 false
 *      @returns err,values
 */
class DataForm extends React.Component {

  state = {
    jurisdictionList: jurisdictionList,
  }

  componentWillReceiveProps (prevProps) {
    if (prevProps.goSubmit && !this.props.goSubmit) {
      this.handleSubmit()
    }
  }

  handleSubmit = () => {
    return this.props.onSubmited(false, JSON.parse(JSON.stringify(this.state.jurisdictionList)))
  }

  onChange = (checkedList, index) => {
    this.setState(state => {
      let list = state.jurisdictionList
      let item = list[index]
      item.checkedList = checkedList
      item.indeterminate = !!checkedList.length && (checkedList.length < item.options.length)
      item.checkAll = checkedList.length === item.options.length
      return {
        jurisdictionList: list
      }
    })
  }

  onCheckAllChange = (e, index) => {
    this.setState(state => {
      let list = state.jurisdictionList
      let item = list[index]
      item.checkedList = e.target.checked ? item.options : []
      item.indeterminate = false
      item.checkAll = e.target.checked
      return {
        jurisdictionList: list
      }
    })
  }

  render () {
    return (
      <div>
        {jurisdictionList.map((item, index) => {
          return (
            <div key={index} className="mb-20">
              <div style={{ borderBottom: '1px solid #E9E9E9' }}>
                <Checkbox
                  indeterminate={item.indeterminate}
                  onChange={(e) => this.onCheckAllChange(e, index)}
                  checked={item.checkAll}
                >{item.name}</Checkbox>
              </div>
              <br />
              <CheckboxGroup options={item.options} value={item.checkedList} onChange={(checkedList) => this.onChange(checkedList, index)} />
            </div>
          )
        })}

      </div>
    )
  }
}

export default DataForm