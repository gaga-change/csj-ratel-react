import React from 'react'
import { Modal } from 'antd'
import RoleAddForm from './roleAddForm.js'
import request from '@lib/request'

/**
 * props:
 *  show<Boolean> 是否显示添加角色弹窗。
 *  onClose<Boolean> 通知父组件关闭当前弹窗。
 */
class RoleAddModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      loading: false,
      goSubmit: false,
    }
  }

  componentWillReceiveProps (prevProps) {
    this.init(prevProps)
  }

  ref = (child) => this.child = child

  /**
   * 初始化，控制窗口显示还是隐藏
   * @param {*} props 
   */
  init (props) {
    if (props.show) {
      this.setState({
        visible: true,
      })
    } else {
      this.setState({
        visible: false,
      })
    }
  }

  /**
   * 窗口点击“确认”按钮
   */
  handleOk = () => {
    this.setState({ goSubmit: true })
  }

  /**
   * 窗口点击“取消”按钮
   */
  handleCancel = () => {
    this.props.onClose(false)
  }
  /**
   * 表单提交
   */
  handleSubmited = (err, value) => {
    this.setState({ goSubmit: false })
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
        this.setState({
          loading: false,
        })
        this.props.onClose(false)
      }).catch(err => {
        this.setState({
          loading: false
        })
      })

    }
  }
  render () {
    const { visible, loading, goSubmit } = this.state
    if (!this.props.show) {
      return null
    } else
      return (
        <div>
          <Modal
            title="添加角色"
            visible={visible}
            onOk={this.handleOk}
            confirmLoading={loading}
            onCancel={this.handleCancel}
          >
            <RoleAddForm goSubmit={goSubmit} onSubmited={this.handleSubmited} onRef={this.ref}></RoleAddForm>
          </Modal>
        </div>
      )
  }
}

export default RoleAddModal