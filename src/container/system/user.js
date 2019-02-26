import React from 'react';
import { Button, Popconfirm } from 'antd';
import _ from 'lodash';
import Sider from '../../component/sider/sider'
import FetchTable from '../../component/fetchTable/fetchTable'
import UserSearchForm from './components/userSearchForm'
import { userConfig_config } from './components/config'
import UserAddModal from './components/userAddModal'
import './style/user.scss'

export default class User extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [{ id: 1 }, { id: 2 }],
      pagination: {

      },
      userAddFormShow: false,
      userJurisdictionModalShow: false,
      loading: false
    }
  }


  componentWillMount() {
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
    this.handleUserAddFormShowChange(true)
  }

  handleTableChange = (pagination, filters, sorter) => {
    console.log(pagination)
  }

  /**
   * 添加角色表单弹窗 状态改变
   */
  handleUserAddFormShowChange = (show) => {
    this.setState((state) => ({
      userAddFormShow: show
    }))
  }

  render() {
    const { dataSource } = this.state;
    const columns = _.cloneDeep(userConfig_config).map(v => {
      if (v.render === '') {
        v.render = (text, record) => {
          return (columns.length >= 1
            ? (
              <span className="Dropdown_Menu_box">
                <span>查看</span>
                <span>禁用</span>
                <Popconfirm title="确定要删除该角色吗?" onConfirm={() => this.handleDelete(record)}>
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
        <UserSearchForm onSubmit={this.handleFormSubmit}></UserSearchForm>
        <div className="alert_Btn">
          <Button type="primary" onClick={this.handleAdd}>创建角色</Button>
        </div>
        <FetchTable
          dataSource={dataSource}
          columns={columns}
          loading={this.state.loading}
          pagination={this.state.pagination}
          onChange={this.handleTableChange} />
        <UserAddModal show={this.state.userAddFormShow} onClose={this.handleUserAddFormShowChange}></UserAddModal>
      </div>
    )
  }
}

