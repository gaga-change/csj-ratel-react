import React from 'react';
import { Button, Popconfirm } from 'antd';
import _ from 'lodash';
import Sider from '../../component/sider/sider'
import request from '@lib/request'
import FetchTable from '../../component/fetchTable/fetchTable'
import { menuConfig_config } from './components/config'
import MenuAddModal from './components/menuAddModal'
import './style/menu.scss'

export default class Menu extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      selectedRowKeys: [],
      expandedRowKeys: [], // 树形表格默认展开行
      pagination: {},
      loading: false,
      menus: [], // 所有菜单项
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
    let { dataSource, pagination } = this.state;
    let data = {
      menuName: '',
      ...json,
      ...this.seachVal,
    }
    request({
      url: '/webApi/base/menu/selectAllMenu',
      method: 'get',
      data: data
    }).then(res => {
      this.setState({menus: res})
      res = res.children
      this._filterMenu(res) // 过滤空 children
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
   * 删除空 children
   */
  _filterMenu(menus) {
    let {expandedRowKeys} = this.state
    menus.forEach((item, index) => {
      item._index = index
      item._faArr = menus
      item.key = item.id
      item.title = item.text
      if (item.children && item.children.length) {
        expandedRowKeys.push(item.id)
        this.setState({expandedRowKeys})        
        this._filterMenu(item.children)
      }
      if (item.children && item.children.length === 0) {
        delete item.children
      }
    })
  }

  /**
   * 添加/编辑 对象按钮
   */
  openMenuFormMoadl = (item) => {
    this.menuAddModal.open(item)
  }

  /** 
   * 关闭 添加/修改 菜单弹窗
   */
  handleMenuAddModalClose = (cancel, obj) => {
    if (!cancel) {
      this.fetch()
    }
  }

  /**
   * 表格选择
   */
  onSelectChange = (selectedRowKeys, other) => {
    this.setState({ selectedRowKeys });
  }

  /**
   * 删除
   */
  handleDelete = (obj) => {
    let { dataSource, menus } = this.state;

    request({
      url: '/webApi/base/menu/delete',
      method: 'get',
      data: {
        menuId: obj.id
      }
    }).then(res => {
      obj._faArr.splice(obj._index, 1)
      this.setState({ dataSource })
      this.setState({ dataSource, menus })
    }).catch(err => {

    })
  }

  onMenuAddModalRef = (child) => this.menuAddModal = child

  render() {
    const { dataSource } = this.state;
    const columns = _.cloneDeep(menuConfig_config).map(v => {
      if (v.render === '') {
        v.render = (text, record) => {
          return (columns.length >= 1
            ? (
              <span className="Dropdown_Menu_box">
                <span onClick={() => this.openMenuFormMoadl(record)}>编辑</span>
                <Popconfirm title="确定要删除菜单吗？" onConfirm={() => this.handleDelete(record)}>
                  <span>删除</span>
                </Popconfirm>
              </span>
            ) : null)
        }
      }
      return v
    })
    return (
      <div className="Menu">
        <Sider history={this.props.history} />
        <div className="alert_Btn">
          <Button type="primary" onClick={() => this.openMenuFormMoadl()}>创建菜单</Button>
        </div>
        <FetchTable
          expandedRowKeys={this.state.expandedRowKeys}
          selectedRowKeys={this.state.selectedRowKeys}
          dataSource={dataSource}
          columns={columns}
          rowKey={"id"}
          onSelectChange={this.onSelectChange}
          loading={this.state.loading}
          pagination={this.state.pagination} />
        <MenuAddModal onRef={this.onMenuAddModalRef} onClose={this.handleMenuAddModalClose} menus={this.state.menus}></MenuAddModal>
      </div>
    )
  }
}

