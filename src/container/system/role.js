import React from 'react';
import { Button, Popconfirm } from 'antd';
import Sider from '../../component/sider/sider'
import FetchTable from '../../component/fetchTable/fetchTable'
import RoleSearchForm from './components/roleSearchForm'
import RoleJurisdictionModal from './components/roleJurisdictionModal'
import roleConfig from './config/roleConfig'
import RoleAddModal from './components/roleAddModal'
import './style/role.scss'

export default class Role extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [{ id: 1 }, { id: 2 }],
      columns: roleConfig.columns,
      pagination: {

      },
      roleAddFormShow: false,
      roleJurisdictionModalShow: false,
      loading: false
    }
  }


  componentWillMount () {
    console.log('componentWillMount')
    let { columns } = this.state;
    columns = columns.map(v => {
      if (v.render === '') {
        v.render = (text, record) => {
          return (columns.length >= 1
            ? (
              <span className="Dropdown_Menu_box">
                <Popconfirm title="确定要删除该角色吗?" onConfirm={() => this.handleDelete(record)}>
                  <span>删除</span>
                </Popconfirm>
                <span onClick={() => this.handleRoleJurisdictionModalShowChange(true)}>操作权限</span>
              </span>
            ) : null)
        }
      }
      return v
    })
    this.setState({ columns })
    this.fetch()
  }

  fetch = () => {

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
    console.log(val)
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

  render () {
    const { dataSource, columns } = this.state;
    return (
      <div className="Role">
        <Sider history={this.props.history} />
        <RoleSearchForm onSubmit={this.handleFormSubmit}></RoleSearchForm>
        <div className="alert_Btn">
          <Button type="primary" onClick={this.handleAdd}>创建角色</Button>
        </div>
        <FetchTable
          dataSource={dataSource}
          columns={columns}
          loading={this.state.loading}
          pagination={this.state.pagination}
          onChange={this.handleTableChange} />
        <RoleAddModal show={this.state.roleAddFormShow} onClose={this.handleRoleAddFormShowChange}></RoleAddModal>
        <RoleJurisdictionModal show={this.state.roleJurisdictionModalShow} onClose={this.handleRoleJurisdictionModalShowChange}></RoleJurisdictionModal>
      </div>
    )
  }
}

