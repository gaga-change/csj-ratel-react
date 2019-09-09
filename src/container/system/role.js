import React from 'react';
import { Button, Popconfirm, message, Breadcrumb } from 'antd';
import _ from 'lodash';
import request from '@lib/request'
import SelectingTable from '../../component/selectionTable/selectionTable'
import RoleSearchForm from './components/roleSearchForm'
import RoleJurisdictionModal from './components/roleJurisdictionModal'
import { roleConfig_config } from './components/config'
import RoleAddModal from './components/roleAddModal'
import './style/role.scss'

export default class Role extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      selectedRowKeys: [],
      loading: false,
      delLoading: false
    }
  }

  seachVal = {} // 搜索内容

  componentWillMount() {
    this.fetch()
  }

  /**
   * 列表数据请求
   */
  fetch = (json = {}) => {
    this.setState({ loading: true })
    let { dataSource } = this.state;
    let data = {
      roleName: '',
      ...json,
      ...this.seachVal,
    }
    request({
      url: '/webApi/base/role/list',
      method: 'get',
      data: data
    }).then(res => {
      dataSource = res
      this.setState({
        dataSource,
        loading: false,
      })
    }).catch(err => {
      this.setState({
        loading: false,
      })
    })
  }

  /**
   * 搜索表单提交
   */
  handleFormSubmit = (val) => {
    this.seachVal = val
    this.fetch()
  }

  /**
   * 添加/编辑 对象按钮
   */
  openRoleFormMoadl = (item) => {
    this.roleAddModal.open(item)
  }

  /**
   * 打开 权限操作 弹窗
   */
  openRoleJurisdictionModal = (...val) => {
    this.roleJurisdictionModal.open(...val)
  }

  /** 
   * 关闭 添加/修改 角色弹窗
   */
  handleRoleAddModalClose = (cancel, obj) => {
    if (obj && obj.id) { // 编辑
      let { dataSource } = this.state
      dataSource.forEach((item, index) => {
        if (item.id === obj.id) {
          dataSource[index] = obj
        }
        this.setState({
          dataSource
        })
      })

      return
    }
    if (!cancel) {
      this.fetch()
    }
  }

  /**
   * 批量删除
   */
  handleDel = () => {
    if (!this.state.selectedRowKeys.length) {
      message.info('请先勾选角色！');
      return
    }
    this.setState({
      delLoading: true,
    })
    request({
      url: '/webApi/base/role/delete',
      method: 'post',
      data: this.state.selectedRowKeys
    }).then(res => {
      message.success('操作成功')
      let ids = this.state.selectedRowKeys.join(',') + ','
      let { dataSource } = this.state
      dataSource = dataSource.filter(item => !~ids.indexOf(item.id + ','))
      this.setState({
        dataSource,
        selectedRowKeys: [],
        delLoading: false,
      })
    }).catch(err => {
      this.setState({
        delLoading: false,
      })
    })
  }

  /**
   * 表格选择
   */
  onSelectChange = (selectedRowKeys, other) => {
    this.setState({ selectedRowKeys });
  }

  onRoleAddModalRef = (child) => this.roleAddModal = child
  onRoleJurisdictionModalRef = (child) => this.roleJurisdictionModal = child

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return
    }
  }

  render() {
    const { dataSource } = this.state;
    const columns = _.cloneDeep(roleConfig_config).map(v => {
      if (v.render === '') {
        v.render = (text, record) => {
          return (columns.length >= 1
            ? (
              <span className="Dropdown_Menu_box">
                <span data-rule-id="system/role-modify" onClick={() => this.openRoleFormMoadl(record)}>编辑</span>
                <span data-rule-id="system/role-menu" onClick={() => this.openRoleJurisdictionModal(record)}>菜单权限</span>
              </span>
            ) : null)
        }
      }
      return v
    })
    return (
      <div className="Role">
        <Breadcrumb >
          <Breadcrumb.Item>系统</Breadcrumb.Item>
          <Breadcrumb.Item>角色管理</Breadcrumb.Item>
        </Breadcrumb>
        <div className="mt10"></div>
        <RoleSearchForm onSubmit={this.handleFormSubmit}></RoleSearchForm>
        <div >
          <Popconfirm title="你确定要删除角色吗?" onConfirm={this.handleDel} okText="确定" cancelText="取消">
            <Button data-rule-id="system/role-delete" className="del-btn" type="primary" loading={this.state.delLoading}>批量删除</Button>
          </Popconfirm>
        </div>
        <div className="alert_Btn">
          <Button data-rule-id="system/role-create" type="primary" onClick={() => this.openRoleFormMoadl()}>创建角色</Button>
        </div>
        <SelectingTable
          selectedRowKeys={this.state.selectedRowKeys}
          dataSource={dataSource}
          columns={columns}
          rowKey={"id"}
          onSelectChange={this.onSelectChange}
          loading={this.state.loading}
          pagination={false} />
        <RoleAddModal onRef={this.onRoleAddModalRef} onClose={this.handleRoleAddModalClose}></RoleAddModal>
        <RoleJurisdictionModal onRef={this.onRoleJurisdictionModalRef}></RoleJurisdictionModal>
      </div>
    )
  }
}

