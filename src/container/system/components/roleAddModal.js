import React from 'react'
import {
  Modal
} from 'antd'
import RoleAddForm from './roleAddForm.js'
import request from '@lib/request'

/**
 * props:
 *  onClose<Function> 通知父组件关闭当前弹窗。
 * child:
 *  open<Function> 打开窗口
 */
class RoleAddModal extends React.Component {
  state = {
    visible: false,
    loading: false,
    goSubmit: false,
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  ref = (child) => this.child = child

  open = (id) => {
    this.init(id)
  }

  /**
   * 初始化，打开窗口
   * @param {*} props 
   */
  init() {
    let {
      visible
    } = this.state
    if (!visible) {
      this.setState({
        visible: true,
      })
    }
  }

  /**
   * 窗口点击“确认”按钮
   */
  handleOk = () => {
    this.setState({
      goSubmit: true
    })
  }

  /**
   * 窗口关闭
   */
  close = (type) => {
    this.setState({
      visible: false
    })
    this.props.onClose && this.props.onClose(type)
  }

  /**
   * 表单提交
   */
  handleSubmited = (err, value) => {
    this.setState({
      goSubmit: false
    })
    if (!err) {
      this.setState({
        loading: true,
      })
      request({
        url: '/webApi/base/role/add',
        method: 'post',
        data: value
      }).then(res => {
        this.child.handleRest()
        this.close()
      }).catch(err => {
        console.error(err)
      }).then(() => {
        this.setState({
          loading: false
        })
      })

    }
  }
  render() {
    const {
      visible,
      loading,
      goSubmit
    } = this.state
    if (!visible) {
      return null
    } else
      return (<div>
        <Modal title="添加角色"
          visible={visible}
          onOk={this.handleOk}
          confirmLoading={loading}
          onCancel={() => this.close('cancel')} >
          <RoleAddForm goSubmit={goSubmit}
            onSubmited={this.handleSubmited}
            onRef={this.ref} >
          </RoleAddForm>
        </Modal>
      </div>
      )
  }
}

export default RoleAddModal