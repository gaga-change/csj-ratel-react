import React from 'react';
import { Modal } from 'antd';
import RoleJurisdictionForm from './roleJurisdictionForm.js'

/**
 * props:
 *  show<Boolean> 是否显示添加角色弹窗。
 *  onClose<Boolean> 通知父组件关闭当前弹窗。
 */
class RoleJurisdictionModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      confirmLoading: false,
      goSubmit: false,
    }
  }
  componentWillReceiveProps (prevProps) {
    this.init(prevProps)
  }

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
        confirmLoading: true,
      })
      setTimeout(() => {
        this.setState({
          confirmLoading: false,
        })
        this.props.onClose(false)
      }, 1000)
    }
  }
  render () {
    const { visible, confirmLoading, goSubmit } = this.state
    if (!this.props.show) {
      return null
    } else
      return (
        <div>
          <Modal
            title="权限配置"
            visible={visible}
            onOk={this.handleOk}
            confirmLoading={confirmLoading}
            onCancel={this.handleCancel}
          >
            <RoleJurisdictionForm goSubmit={goSubmit} onSubmited={this.handleSubmited}></RoleJurisdictionForm>
          </Modal>
        </div>
      )
  }
}

export default RoleJurisdictionModal