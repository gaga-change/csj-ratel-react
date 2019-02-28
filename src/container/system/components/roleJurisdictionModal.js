import React from 'react';
import { Modal } from 'antd';
import RoleJurisdictionForm from './roleJurisdictionForm.js'

/**
 * props:
 *  onRef<Function> 回传当前组件对象
 * child:
 *  open<Function> 打开窗口
 *     (obj) 如果传递一个数据对象则为编辑
 */
class RoleJurisdictionModal extends React.Component {
  state = {
    visible: false,
    confirmLoading: false,
    goSubmit: false,
  }

  componentDidMount() {
    this.props.onRef(this)
  }
  
  open = () => this.init()

  /**
   * 初始化，控制窗口显示还是隐藏
   * @param {*} props 
   */
  init = () => {
    let { visible } = this.state
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
    this.setState({ goSubmit: true })
  }

  /**
   * 窗口关闭
   */
  close = (type, obj) => {
    this.setState({
      visible: false
    })
    this.props.onClose && this.props.onClose(type, obj)
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
        this.close()
      }, 1000)
    }
  }

  render() {
    const { visible, confirmLoading, goSubmit } = this.state
    if (!visible) {
      return null
    } else
      return (
        <div>
          <Modal
            title="权限配置"
            visible={visible}
            onOk={this.handleOk}
            confirmLoading={confirmLoading}
            onCancel={() => this.close('cancel')}
          >
            <RoleJurisdictionForm goSubmit={goSubmit} onSubmited={this.handleSubmited}></RoleJurisdictionForm>
          </Modal>
        </div>
      )
  }
}

export default RoleJurisdictionModal