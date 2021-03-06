import React from 'react';
import { Button, Popconfirm, message, Breadcrumb } from 'antd';
import _ from 'lodash';
import FetchTable from '../../component/fetchTable/fetchTable'
import { menuConfig_config } from './components/config'
import MenuAddModal from './components/menuAddModal'
import { selectAllMenu, menuDelete } from 'api'
import { sortMenu } from 'lib'
import './style/menu.scss'

export default class Menu extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      expandedRowKeys: [], // 树形表格默认展开行
      loading: false,
      menus: [], // 所有菜单项
    }
  }

  seachVal = {} // 搜索内容

  componentDidMount() {
    this.fetch()
  }

  /**
   * 列表数据请求
   */
  fetch = (json = {}) => {
    this.setState({ loading: true })
    selectAllMenu({
      menuName: '',
      ...json,
      ...this.seachVal,
    }).then(res => {
      this.setState({ loading: false })
      if (!res) return
      sortMenu(res.data)
      this.setState({ menus: res.data })
      res = res.data.children
      this._filterMenu(res) // 过滤空 children
      this.setState({ dataSource: res })
    })
  }

  /**
   * 删除空 children
   */
  _filterMenu(menus) {
    let { expandedRowKeys } = this.state
    menus.forEach((item, index) => {
      item._index = index
      item._faArr = menus
      item.key = item.id
      item.title = item.text
      if (item.children && item.children.length) {
        expandedRowKeys.push(item.id)
        this.setState({ expandedRowKeys })
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
   * 删除
   */
  handleDelete = (obj) => {
    let { dataSource, menus } = this.state;
    menuDelete({ menuId: obj.id }).then(res => {
      if (!res) return
      message.success('操作成功')
      obj._faArr.splice(obj._index, 1)
      this.setState({ dataSource })
      this.setState({ dataSource, menus })
    })
  }

  onMenuAddModalRef = (child) => this.menuAddModal = child
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return
    }
  }

  render() {
    const { dataSource, expandedRowKeys, loading, menus } = this.state;
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
        <Breadcrumb >
          <Breadcrumb.Item>系统</Breadcrumb.Item>
          <Breadcrumb.Item>菜单管理</Breadcrumb.Item>
        </Breadcrumb>
        <div className="mt10"></div>
        <div className="alert_Btn">
          <Button type="primary" onClick={() => this.openMenuFormMoadl()}>创建菜单</Button>
        </div>
        <FetchTable
          expandedRowKeys={expandedRowKeys}
          dataSource={dataSource}
          columns={columns}
          rowKey={"id"}
          loading={loading}
          pagination={false} />
        <MenuAddModal onRef={this.onMenuAddModalRef} onClose={this.handleMenuAddModalClose} menus={menus}></MenuAddModal>
      </div>
    )
  }
}

