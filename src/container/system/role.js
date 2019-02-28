import React from 'react';
import { Button, Popconfirm, message} from 'antd';
import _ from 'lodash';
import Sider from '../../component/sider/sider'
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
      pagination: {},
      roleAddFormShow: false,
      roleJurisdictionModalShow: false,
      loading: false,
      delLoading: false
    }
  }


  componentWillMount() {
    this.fetch()
  }

  fetch = (json = {}) => {
    this.setState({ loading: true })
    let { dataSource, pagination } = this.state;
    let data = {
      roleName: '',
      ...json,
    }
    request({
      url: '/webApi/base/role/list',
      method: 'get',
      data: data
    }).then(res => {
      dataSource = res
      pagination.total = res.length
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
   * 删除
   */
  handleDelete = (item) => {
    console.log(item)
  }

  /**
   * 搜索表单提交
   */
  handleFormSubmit = (val) => {
    this.fetch(val)
  }

  /**
   * 添加对象按钮
   */
  handleAdd = () => {
    this.handleRoleAddFormShowChange(true)
  }

  handleTableChange = (pagination, filters, sorter) => {
    console.log(pagination)
  }

  /**
   * 添加角色表单弹窗 状态改变
   */
  handleRoleAddFormShowChange = (show) => {
    this.setState((state) => ({
      roleAddFormShow: show
    }))
  }

  /**
   * 操作权限表单弹窗 状态改变
   */
  handleRoleJurisdictionModalShowChange = (show) => {
    this.setState((state) => ({
      roleJurisdictionModalShow: show
    }))
  }


  /**
   * 批量删除
   */
  handleDel = () => {
    console.log(this.state.selectedRowKeys)
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
      let ids = this.state.selectedRowKeys.join(',') + ','
      let {dataSource} = this.state
      dataSource =  dataSource.filter(item => !~ids.indexOf(item.id+','))
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
    console.log('当前选择的key值 ', selectedRowKeys, other);
    this.setState({ selectedRowKeys });
  }

  render() {
    const { dataSource } = this.state;
    const columns = _.cloneDeep(roleConfig_config).map(v => {
      if (v.render === '') {
        v.render = (text, record) => {
          return (columns.length >= 1
            ? (
              <span className="Dropdown_Menu_box">
                {/* <Popconfirm title="确定要删除该角色吗?" onConfirm={() => this.handleDelete(record)}>
                  <span></span>
                </Popconfirm> */}
                <span>编辑</span>
                <span onClick={() => this.handleRoleJurisdictionModalShowChange(true)}>操作权限</span>
              </span>
            ) : null)
        }
      }
      return v
    })
    return (
      <div className="Role">
        <Sider history={this.props.history} />
        <RoleSearchForm onSubmit={this.handleFormSubmit}></RoleSearchForm>
        <div>
        <Popconfirm title="你确定要删除角色吗?" onConfirm={this.handleDel} okText="确定" cancelText="取消">
          <Button className="del-btn" type="primary" loading={this.state.delLoading}>批量删除</Button>
        </Popconfirm>
        </div>
        <div className="alert_Btn">
          <Button type="primary" onClick={this.handleAdd}>创建角色</Button>
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
        <RoleAddModal show={this.state.roleAddFormShow} onClose={this.handleRoleAddFormShowChange}></RoleAddModal>
        <RoleJurisdictionModal show={this.state.roleJurisdictionModalShow} onClose={this.handleRoleJurisdictionModalShowChange}></RoleJurisdictionModal>
      </div>
    )
  }
}

