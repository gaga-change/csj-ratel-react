import React from 'react';
import { Checkbox } from 'antd';
import request from '@lib/request'

const CheckboxGroup = Checkbox.Group;

/**
 * props:
 *  goSubmit<Boolean> 是否进行表单提交操作。如果 false->true 则会提交表单
 *  onSubmited<Function> 表单提交结束。通知父组件将goSubmit修改为 false
 *      @returns err,values
 */
class DataForm extends React.Component {

  state = {
    jurisdictionList: [],
  }

  componentDidMount() {
    this.initDicts()
  }

  componentWillReceiveProps(prevProps) {
    if (prevProps.goSubmit && !this.props.goSubmit) {
      this.handleSubmit()
    }
  }

  /**
  * 初始化获取权限列表
  */
  initDicts = () => {
    request({
      url: '/webApi/base/menu/selectAllMenu',
      method: 'get'
    }).then(res => {
      let dicts = res.children
      dicts = dicts.map((item, index) => {
        let obj = {
          options: item.children.map(son => {
            return {
              label: son.text,
              value: son.id
            }
          }),
          text: item.text,
          id: item.id,
          checkedList: [],
          indeterminate: false,
          checkAll: false,
        }
        return obj
      })
      this.setState({ jurisdictionList: dicts })
    }).catch(err => {
      console.error(err)
    })
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
    let { jurisdictionList } = this.state
    let item = jurisdictionList[index]
    item.checkedList = e.target.checked ? item.options.map(v => v.value) : []
    item.indeterminate = false
    item.checkAll = e.target.checked
    this.setState({ jurisdictionList })
  }

  render() {
    let { jurisdictionList } = this.state
    return (
      <div>
        {
          jurisdictionList.map((item, index) => {
            return (
              <div className="role-jurisdiction-item" key={index}>
                <div className="item-title">
                  <Checkbox
                    indeterminate={item.indeterminate}
                    onChange={(e) => this.onCheckAllChange(e, index)}
                    checked={item.checkAll}
                  >{item.text}</Checkbox>
                </div>
                <br />
                {!!item.options.length && <CheckboxGroup options={item.options} value={item.checkedList} onChange={(checkedList) => this.onChange(checkedList, index)} />}
              </div>
            )
          })}
      </div>
    )
  }
}

export default DataForm