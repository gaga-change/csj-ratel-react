import React from 'react';
import { Modal } from 'antd';
import UserAddForm from './userAddForm.js'
import request from '@lib/request'

/**
 * props:
 *  onClose<Function> 弹窗关闭事件。
 *  onRef<Function> 回传当前组件对象
 * child:
 *  open<Function> 打开窗口
 *     (obj) 如果传递一个数据对象则为编辑
 */
class UserAddModal extends React.Component {
  state = {
    visible: false,
    confirmLoading: false,
    goSubmit: false,
    obj: null
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  ref = (child) => this.child = child
  open = (obj) => this.init(obj)

  /**
   * 初始化，控制窗口显示还是隐藏
   * @param {*} props 
   */
  init(obj) {
    this.setState({ obj })
    let { visible } = this.state
    if (!visible) {
      this.setState({
        visible: true,
      })
    }
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
   * 窗口点击“确认”按钮
   */
  handleOk = () => {
    this.setState({ goSubmit: true })
  }

  /**
   * 表单提交
   */
  handleSubmited = (err, value) => {
    console.log(value)
    let info = sessionStorage.getItem('info')
    info = info ? JSON.parse(info) : {}
    this.setState({ goSubmit: false })
    if (!err) {
      this.setState({
        confirmLoading: true,
      })
      let { obj } = this.state
      if (obj) {
        value.userId = obj.id
      }
      request({
        url: '/webApi/base/user/add',
        method: 'post',
        data: {
          ...value,
          isAdmin: 0,
          userStatus: 0,
          ownerCode: info.ownerCode,
          ownerName: info.ownerName
        }
      }).then(res => {
        this.child.handleRest()
        this.close(null, { ...obj, ...value })
      }).catch(err => {
        console.error(err)
      }).then(() => {
        this.setState({
          confirmLoading: false,
        })
      })


    }
  }
  render() {
    const { visible, confirmLoading, goSubmit } = this.state

    return (
      <div>
        <Modal
          title="添加用户"
          visible={visible}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={() => this.close('cancel')}
        >
          <UserAddForm goSubmit={goSubmit} onSubmited={this.handleSubmited} onRef={this.ref} roles={this.props.roles} obj={this.state.obj}></UserAddForm>
        </Modal>
      </div>
    )
  }
}

export default UserAddModal