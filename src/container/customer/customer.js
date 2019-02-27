import React from 'react'
import _ from 'lodash'
import Sider from '../../component/sider/sider'
import SearchForm from './component/search'
import AddForm from './component/add'
import AddressForm from './component/address'
import FetchTable from '@component/fetchTable/fetchTable'
import {
  indexTableColumnsConfig,
  addressTableColumnsConfig
} from './component/config'
import { Button, Modal, Tag, Spin } from 'antd'
import fetchData from '@lib/request'
import { transFnc } from '@lib/lib'
import { connect } from 'react-redux'
import './customer.scss'

@connect(state => state)
export default class Customer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      pagination: {},
      visible_addCustomer: false,
      visible_address: false,
      visible_operation: false,
      dataSource: [],
      activeOperation: '新增地址',
      address_dataSource: [],
      address_loading: false,
      spinning: false,
      customerspinning: false,
      basicCustomerInfoId: null,
      addressDetail: { isDefault: 1 }
    }
  }

  onSearchSubmit = (type, value) => {
    console.log(type, value)
    let realvalue = {}
    for (let sub in value) {
      if (value[sub] !== '' && value[sub] !== null && value[sub] !== undefined) {
        realvalue[sub] = value[sub]
      }
    }
    this.fetch(realvalue)
  }
  onAddSubmit = (type, value) => {
    console.log(type, value)
    const { info } = this.props.info
    this.setState({ customerspinning: true })
    fetchData({
      url: '/webApi/customer/save',
      method: 'post',
      data: {
        ...value,
        ownerCode: info.ownerCode,
        ownerName: info.ownerName
      }
    })
      .then(res => {
        console.log(res)
        this.setState({ customerspinning: false })
        this.fetch()
      })
      .catch(err => {
        console.log(err)
        this.setState({ customerspinning: false })
      })
  }

  handleTableChange = (pagination, filters, sorter) => {
    console.log(pagination)
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = (params) => {
    const { info } = this.props.info
    fetchData({
      url: '/webApi/customer/list',
      method: 'post',
      data: {
        ...params,
        ownerCode: info.ownerCode
      }
    })
      .then(res => {
        console.log(res)
        res.list.forEach((item, index) => (item.index = index + 1))
        this.setState({ dataSource: res.list })
      })
      .catch(err => {
        console.log(err)
      })
  }

  showAddCustomer = () => {
    this.setState({ visible_addCustomer: true })
  }

  showAddress = record => {
    this.setState({ visible_address: true, address_loading: true })
    fetchData({
      url: '/webApi/customer/addr/list',
      method: 'post',
      data: {
        pageSize: 10,
        pageNum: 1,
        basicCustomerInfoId: record.id
      }
    })
      .then(res => {
        console.log(res)
        this.setState({ address_loading: false })
        res.list.forEach((item, index) => {
          item.index = index + 1
          item.area = `${item.customerProvince}/${item.customerCity}/${
            item.customerArea
          }`
        })
        this.setState({
          address_dataSource: res.list,
          basicCustomerInfoId: record.id
        })
      })
      .catch(err => {
        console.log(err)
        this.setState({ address_loading: false })
      })
  }

  handleCancel = type => {
    if (type === 'visible_operation') {
      this.setState({ visible_operation: false })
    } else {
      this.setState({ visible_addCustomer: false, visible_address: false })
    }
  }

  handleOk = e => {
    this.child.handleSubmit(e)
  }

  ref = res => {
    this.child = res
  }
  addAddress = (type, value) => {
    console.log('这是新增地址的回调', type, value)

    this.setState({ visible_operation: true, addressDetail: { isDefault: 1 } })
  }
  deleteAddress = (type, value) => {
    console.log('这是删除地址的回调', type, value)
    const { area, ...rest } = value
    let url = '/webApi/customer/addr/del'
    let data = {
      id: value.id
    }
    this.setState({ spinning: true})
    fetchData({
      url,
      method: 'get',
      data
    })
      .then(res => {
        console.log(res)
        this.setState({ spinning: false})
        this.showAddress({ id: this.state.basicCustomerInfoId })
      })
      .catch(err => {
        console.log(err)
        this.setState({ spinning: false })
      })
  }
  operationAddress = (type, value) => {
    console.log('这是修改地址的回调', type, value)

    this.setState({ visible_operation: true, addressDetail: value })
  }
  handleOperationAddress = (type, value) => {
    const { area, ...rest } = value
    let url = '/webApi/customer/addr/save'
    let data = {
      ...rest,
      isDefault: value.isDefault ? 1 : 0,
      customerProvince: area[0],
      customerCity: area[1],
      customerArea: area[2],
      basicCustomerInfoId: this.state.basicCustomerInfoId
    }
    if (Object.keys(this.state.addressDetail).length > 1) {
      // 如果是修改
      url = '/webApi/customer/addr/update'
      data.id = this.state.addressDetail.id
    }
    this.setState({ visible_operation: true, spinning: true })
    fetchData({
      url,
      method: 'post',
      data
    })
      .then(res => {
        console.log(res)
        this.setState({ spinning: false, visible_operation: false })
        this.showAddress({ id: this.state.basicCustomerInfoId })
      })
      .catch(err => {
        console.log(err)
        this.setState({ spinning: false })
      })
  }

  render() {
    const {
      dataSource,
      visible_addCustomer,
      visible_address,
      activeOperation,
      visible_operation,
      address_dataSource,
      address_loading
    } = this.state
    const columns = _.cloneDeep(indexTableColumnsConfig).map(v => {
      if (v.render === '') {
        v.render = (ext, record, index) => {
          return (
            <span className="Dropdown_Menu_box">
              <span
                onClick={() => {
                  this.showAddress(record)
                }}
              >
                维护地址
              </span>
              <span>删除</span>
            </span>
          )
        }
      }
      return v
    })

    const address_columns = _.cloneDeep(addressTableColumnsConfig).map(v => {
      if (v.render === '') {
        v.render = (ext, record, index) => {
          return (
            <span>
              {v.renderType === 'operation' && (
                <span className="Dropdown_Menu_box">
                  <span
                    onClick={this.operationAddress.bind(this, 'update', record)}
                  >
                    修改
                  </span>
                  <span
                    onClick={this.deleteAddress.bind(this, 'delete', record)}
                  >
                    删除
                  </span>
                </span>
              )}
              {record.isDefault === 1 && v.renderType === 'tag' && (
                <span className="Dropdown_Menu_box">
                  {/* <span>设为默认</span> */}
                  <Tag color="volcano">默认地址</Tag>
                </span>
              )}
            </span>
          )
        }
      }
      return v
    })

    return (
      <div className="Customer">
        <Sider history={this.props.history} />
        <SearchForm
          selectWordsArr={['客户名称', '负责人', '手机']}
          onSubmit={this.onSearchSubmit.bind(this, 'search')}
        />
        <div className="Customer_addBtn">
          <Button type="primary" onClick={this.showAddCustomer}>
            新增客户
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
          visible={visible_addCustomer}
          onCancel={this.handleCancel}
          onOk={this.handleOk}
        >
          <Spin tip="Loading..." spinning={this.state.customerspinning}>
            <AddForm
              onRef={this.ref}
              onSubmit={this.onAddSubmit.bind(this, 'add')}
            />
          </Spin>
        </Modal>

        <Modal
          title="维护地址"
          width={1000}
          centered={true}
          bodyStyle={{ paddingBottom: 16 }}
          footer={null}
          onCancel={this.handleCancel}
          visible={visible_address}
        >
          <div className="alert_Btn">
            <Button type="primary" onClick={this.addAddress.bind(this, 'add')}>
              新增地址
            </Button>
          </div>
          <FetchTable
            dataSource={address_dataSource}
            useIndex={true}
            columns={address_columns}
            loading={address_loading}
            pagination={false}
          />
        </Modal>

        <Modal
          title={activeOperation}
          width={1000}
          destroyOnClose={true}
          centered={true}
          bodyStyle={{ paddingBottom: 16 }}
          footer={null}
          onCancel={this.handleCancel.bind(this, 'visible_operation')}
          visible={visible_operation}
        >
          <Spin tip="Loading..." spinning={this.state.spinning}>
            <AddressForm
              addressDetail={this.state.addressDetail}
              onSubmit={this.handleOperationAddress.bind(this, 'address')}
            />
          </Spin>
        </Modal>
      </div>
    )
  }
}
