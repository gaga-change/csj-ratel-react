import React from 'react'
import { Modal } from 'antd'
import RoleAddForm from './roleAddForm.js'
import request from '@lib/request'

/**
 * props:
 *  onClose<Function> 弹窗关闭事件。
 *  onRef<Function> 回传当前组件对象
 * child:
 *  open<Function> 打开窗口
 *     (obj) 如果传递一个数据对象则为编辑
 */
class RoleAddModal extends React.Component {
  state = {
    visible: false,
    loading: false,
    goSubmit: false,
    obj: null,
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  ref = (child) => this.child = child
  open = (obj) => this.init(obj)

  /**
   * 初始化，打开窗口
   * @param {*} props 
   */
  init = (obj) => {
    let { visible } = this.state
    if (!visible) {
      this.setState({
        visible: true,
        obj,
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
    this.setState({
      goSubmit: false
    })
    if (!err) {
      this.setState({
        loading: true,
      })
      let { obj } = this.state
      if (obj) {
        value.roleId = obj.id
      }
      request({
        url: obj ? '/webApi/base/role/update' : '/webApi/base/role/add',
        method: 'post',
        data: value
      }).then(res => {
        this.child.handleRest()
        this.close(null, { ...obj, ...value })
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
    const { visible, loading, goSubmit } = this.state
    if (!visible) {
      return null
    } else
      return (<div>
        <Modal title={this.state.obj ? '编辑菜单' : '添加菜单'}
          visible={visible}
          onOk={this.handleOk}
          confirmLoading={loading}
          onCancel={() => this.close('cancel')} >
          <RoleAddForm
            obj={this.state.obj}
            goSubmit={goSubmit}
            onSubmited={this.handleSubmited}
            onRef={this.ref} >
          </RoleAddForm>
        </Modal>
      </div>)
  }
}

export default RoleAddModal