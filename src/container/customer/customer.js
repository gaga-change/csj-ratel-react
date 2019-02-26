import React from 'react'
import Sider from '../../component/sider/sider'
import SearchForm from './component/search'
import AddForm from './component/add'
import AddressForm from './component/address'
import FetchTable from '@component/fetchTable/fetchTable'
import { indexTableColumnsConfig } from './component/config'
import { Button, Modal } from 'antd'
import fetchData from '@lib/request'
import {connect} from 'react-redux';
import './customer.scss'

@connect(
  state=>state
)

export default class Customer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      pagination: {},
      columns: indexTableColumnsConfig,
      visible: false,
      addressVisible: false,
      dataSource: [{ id: 1 }]
    }
  }
  onSubmit = (type, value) => {
    this.setState({ visible: false })
  }
  handleTableChange = (pagination, filters, sorter) => {
    console.log(pagination)
  }
  componentDidMount() {
    let { columns } = this.state
    columns=columns.map(v => {
      if (v.render === '') {
        v.render = (ext, record, index) => {
          return (
            <span className="Dropdown_Menu_box">
              <span onClick={this.showAddress}>维护地址</span>
              <span>删除</span>
            </span>
          )
        }
      }
      return v
    })
    this.setState({ columns })
    this.fetch()
  }
  fetch = () => {
    const { info } = this.props.info
    fetchData({
      url: '/webApi/customer/list',
      method: 'post',
      data: {
        pageSize: 10,
        pageNum: 1,
        ownerCode: info.ownerCode
      }
    }).then(res => {
      console.log(res);
      res.list.forEach((item, index) => item.index = index + 1)
      this.setState({ dataSource: res.list })
    }).catch(err => {
      console.log(err);
    })
  }
  addCustomer = () => {
    this.setState({ visible: true })
  }
  showAddress = () => {
    this.setState({ addressVisible: true })
  }
  handleCancel = () => {
    this.setState({ visible: false })
  }
  addressCancel = () => {
    this.setState({ addressVisible: false })
  }
  handleOk = () => {}
  ref = res => {
    this.child = res
  }
  render() {
    const { dataSource, columns, visible, addressVisible } = this.state
    return (
      <div className="Customer">
        <Sider history={this.props.history} />
        <SearchForm onSubmit={this.onSubmit.bind(this, 'search')} />
        <div className="Customer_addBtn">
          <Button type="primary" onClick={this.addCustomer}>
            创建商品
          </Button>
        </div>
        <FetchTable
          dataSource={dataSource}
          columns={columns}
          loading={this.state.loading}
          pagination={this.state.pagination}
          onChange={this.handleTableChange}
        />
        <Modal
          title="新增客户"
          okText="保存"
          centered={true}
          bodyStyle={{ paddingBottom: 0 }}
          visible={visible}
          onCancel={this.handleCancel}
          onOk={this.handleOk}
        >
          <AddForm
            onRef={this.ref}
            onSubmit={this.onSubmit.bind(this, 'add')}
          />
        </Modal>
        <Modal
          title="维护地址"
          width="60%"
          centered={true}
          bodyStyle={{ paddingBottom: 0 }}
          footer={null}
          onCancel={this.addressCancel}
          visible={addressVisible}
        >
          <AddressForm
            onRef={this.ref}
            onSubmit={this.onSubmit.bind(this, 'address')}
          />
        </Modal>
      </div>
    )
  }
}
