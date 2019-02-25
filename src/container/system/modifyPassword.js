import React from 'react';
import { Modal } from 'antd';
import './style/modifyPassword.scss'
import ModifyPasswordForm from './components/modifyPasswordForm.js'

export default class System extends React.Component {
  state = {
    visible: false,
    confirmLoading: false,
    goSubmit: false, // 是否点击确定
  }
  componentDidMount () {
    if (this.props.show) {
      this.showModal()
    }
  }
  componentWillReceiveProps (prevProps) {
    if (prevProps.show) {
      this.showModal()
    }
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk = () => {
    this.setState({
      confirmLoading: true,
    })
    // 通知表单 进行 数据提交
    this.setState({ goSubmit: true })
  }
  handleFormSubmited = (err, value) => {
    if (!err) { // 数据校验正常
      console.log('form data:', value)
      setTimeout(() => {
        this.setState({
          visible: false,
          confirmLoading: false,
        });
        this.props.onClose()
      }, 1000)
    } else {
      this.setState({
        confirmLoading: false,
      })
    }
    this.setState({ goSubmit: false })
  }
  handleCancel = () => {
    this.setState({
      visible: false,
    })
    this.props.onClose && this.props.onClose()
  }
  render () {
    const { visible, confirmLoading } = this.state;
    if (!this.props.show) {
      return null
    }
    return (
      <div className="ModifyPassword">
        <Modal
          title="修改密码"
          visible={visible}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
        >
          <ModifyPasswordForm goSubmit={this.state.goSubmit} onSubmited={this.handleFormSubmited}></ModifyPasswordForm>
        </Modal>
      </div>
    )
  }
}

