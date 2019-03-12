import React from 'react';
import { Modal,message } from 'antd';
import RoleJurisdictionForm from './roleJurisdictionForm.js'
import './roleJurisdiction.scss'
import request from '@lib/request'

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
    menus: [] // 已拥有角色
  }
  obj = null
  componentDidMount() {
    this.props.onRef(this)
  }

  open = (obj) => this.init(obj)

  /**
   * 初始化，控制窗口显示还是隐藏
   * @param {*} props 
   */
  init = (obj) => {
    this.obj = obj

    request({
      url: '/webApi/base/role/selectMenus',
      method: 'get',
      data: {
        roleId: this.obj.id,
      }
    }).then(res => {
      this.setState({menus: res})
    }).catch(err => {
      console.error(err)
    })

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
    this.setState({menus: []})
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
    if (err) return
    this.setState({
      confirmLoading: true,
    })
    let menuList = []
    value.forEach(item => {
      if (item.checkAll || item.indeterminate) {
        menuList.push(item.id)
      }
      if (item.checkedList.length) {
        menuList.push( ...item.checkedList)
      }
    })
    request({
      url: '/webApi/base/role/addMenu',
      method: 'post',
      data: {
        roleId: this.obj.id,
        menuList
      }
    }).then(res => {
      message.success('操作成功')
      this.close()
    }).catch(err => {
      console.error(err)
    }).then(() => {
      this.setState({
        confirmLoading: false,
      })
    })
  }

  render() {
    const { visible, confirmLoading, goSubmit } = this.state
    return (
      <div className="RoleJurisdiction">
        <Modal
          title="菜单权限配置"
          visible={visible}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={() => this.close('cancel')}
        >
          <RoleJurisdictionForm goSubmit={goSubmit} onSubmited={this.handleSubmited} checkedList={this.state.menus}></RoleJurisdictionForm>
        </Modal>
      </div>
    )
  }
}

export default RoleJurisdictionModal