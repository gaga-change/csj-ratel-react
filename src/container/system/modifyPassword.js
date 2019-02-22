import React from 'react';
import { Modal, Button } from 'antd';
import './modifyPassword.scss'

export default class System extends React.Component {
  state = {
    ModalText: 'Content of the modal',
    visible: false,
    confirmLoading: false,
  }
  componentWillReceiveProps (prevProps) {
    this.showModal()
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk = () => {
    this.setState({
      ModalText: 'The modal will be closed after two seconds',
      confirmLoading: true,
    });
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false,
      });
      this.props.onClose && this.props.onClose()
    }, 2000);
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    })
    this.props.onClose && this.props.onClose()
  }
  render () {
    const { visible, confirmLoading, ModalText } = this.state;
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
          <p>{ModalText}</p>
        </Modal>
      </div>
    )
  }
}

