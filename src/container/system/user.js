import React from 'react';
import { Button, Popconfirm, message } from 'antd';
import _ from 'lodash';
import request from '@lib/request'
import Sider from '../../component/sider/sider'
import SelectingTable from '../../component/selectionTable/selectionTable'
import UserSearchForm from './components/userSearchForm'
import { userConfig_config } from './components/config'
import UserAddModal from './components/userAddModal'
import './style/user.scss'

export default class User extends React.Component {
  state = {
    dataSource: [],
    pagination: {},
    userJurisdictionModalShow: false,
    loading: false,
    delLoading: false, // 删除更多按钮加载提示
    selectedRowKeys: [], // 多选框选中的id列表
    roles: [], // 角色列表
  }
  seachVal = {} // 搜索内容
  componentWillMount() {
    this.fetch()
    this.initRole()
  }

  fetch = (json = {}) => {
    this.setState({ loading: true })
    let { dataSource, pagination } = this.state;
    let data = {
      ...json,
      pageNum: pagination.current || 1,
      pageSize: pagination.pageSize || 10,
      ...this.seachVal
    }
    request({
      url: '/webApi/base/user/selectByCondition',
      method: 'post',
      data: data
    }).then(res => {
      if (res.list && Array.isArray(res.list)) {
        res.list.forEach(item => {
          item.gmtCreate = this._formData(item.gmtCreate)
          item.statusName = item.userStatus === 0 ? '启用' : '禁用'
        })
        dataSource = res.list
        pagination.total = res.total
      }
      this.setState({
        dataSource,
        pagination,
        loading: false,
      })
    }).catch(err => {
      this.setState({
        loading: false,
      })
    })
  }

  /**
   * 初始化角色列表
   */
  initRole = () => {
    request({
      url: '/webApi/base/role/list',
      method: 'get',
      data: { roleName: '' }
    }).then(res => {
      this.setState({ roles: res })
    }).catch(err => {

    })
  }

  /**
   * 删除
   */
  handleDelete = (obj) => {
    console.log(obj)
    let { dataSource } = this.state;

    request({
      url: '/webApi/base/user/delete',
      method: 'post',
      data: [obj.id]
    }).then(res => {
      dataSource = dataSource.filter(v => v.id !== obj.id)
      this.setState({ dataSource })
    }).catch(err => {

    })
  }


  /**
   * 批量删除
   */
  handleDeleteMore = () => {
    if (!this.state.selectedRowKeys.length) {
      message.info('请先勾选用户！');
      return
    }
    this.setState({
      delLoading: true,
    })
    request({
      url: '/webApi/base/user/delete',
      method: 'post',
      data: this.state.selectedRowKeys
    }).then(res => {
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
   * 搜索表单提交
   */
  handleFormSubmit = (val) => {
    this.seachVal = val
    this.fetch()
  }

  /**
   * 添加对象按钮
   */
  handleAdd = (obj) => {
    this.userAddModal.open(obj)
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.setState({
      pagination
    }, () => {
      this.fetch()
    })
  }

  /**
  * 表格选择
  */
  onSelectChange = (selectedRowKeys, other) => {
    this.setState({ selectedRowKeys });
  }

  /**
   * 添加角色表单弹窗 关闭
   */
  handleUserAddModalClose = (type, obj) => {
    this.fetch()
  }

  handleDisableUser = (obj) => {
    let { dataSource } = this.state
    obj.userStatus = obj.userStatus === 0 ? 1 : 0
    request({
      url: '/webApi/base/user/updateUserStatus',
      method: 'post',
      data: {
        userId: obj.id,
        userStatus: obj.userStatus === 0 ? 1 : 0
      }
    }).then(res => {
      this.setState({ dataSource })
    }).catch(err => {

    })
  }

  /**
   * 时间转换器
   */
  _formData(date) {
    date = new Date(date)
    let d = new Date()
    function _(num) {
      if (num < 10) {
        return '0' + num
      }
      return num
    }
    return `${d.getFullYear()}-${_(d.getMonth() + 1)}-${_(d.getDay())} ${_(d.getHours())}:${_(d.getMinutes())}:${_(d.getSeconds())}`
  }

  handleUserAddModalRef = child => this.userAddModal = child

  render() {
    const { dataSource } = this.state;
    const columns = _.cloneDeep(userConfig_config).map(v => {
      if (v.render === '') {
        v.render = (text, record) => {
          let statusName = record.userStatus === 0 ? '禁用' : '启用'
          return (columns.length >= 1
            ? (
              <span className="Dropdown_Menu_box">
                <span onClick={() => this.handleAdd(record)}>查看</span>
                <Popconfirm title={`确定要${statusName}该账户吗？`} onConfirm={() => this.handleDisableUser(record)}>
                  <span>{statusName}</span>
                </Popconfirm>
                <Popconfirm title="确定要删除账户吗？" onConfirm={() => this.handleDelete(record)}>
                  <span>删除</span>
                </Popconfirm>
              </span>
            ) : null)
        }
      }
      return v
    })
    return (
      <div className="User">
        <Sider history={this.props.history} />
        <UserSearchForm onSubmit={this.handleFormSubmit} roles={this.state.roles}></UserSearchForm>
        <div>
          <Popconfirm title="你确定要删除角色吗?" onConfirm={this.handleDeleteMore} okText="确定" cancelText="取消">
            <Button className="del-btn" type="primary" loading={this.state.delLoading}>批量删除</Button>
          </Popconfirm>
        </div>
        <div className="alert_Btn">
          <Button type="primary" onClick={() => this.handleAdd()}>创建用户</Button>
        </div>
        <SelectingTable
          selectedRowKeys={this.state.selectedRowKeys}
          dataSource={dataSource}
          columns={columns}
          rowKey={"id"}
          onSelectChange={this.onSelectChange}
          loading={this.state.loading}
          pagination={this.state.pagination}
          onChange={this.handleTableChange} />
        <UserAddModal onClose={this.handleUserAddModalClose} onRef={this.handleUserAddModalRef} roles={this.state.roles}></UserAddModal>
      </div>
    )
  }
}

