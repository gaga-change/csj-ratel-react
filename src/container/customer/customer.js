import React from 'react'
import _ from 'lodash'
import { stringify, parse } from 'qs';
import SearchForm from './component/search'
import AddForm from './component/add'
import AddressForm from './component/address'
import FetchTable from '@component/fetchTable/fetchTable'
import { indexTableColumnsConfig, addressTableColumnsConfig } from './component/config'
import { Button, Modal, Tag, Spin, Popconfirm, message } from 'antd'
import { customerDel, customerSave, customerAddrSave, customerAddrUpdate, customerList, customerAddrList, customerAddrDefault } from 'api'
import './customer.scss'

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
      basicCustomerInfo: {},
      addressDetail: {}
    }
  }


  componentDidMount() {
    this.fetch()
  }

  onSubmit = (type, value) => {
    if (type === 'add') {
      this.setState({ customerspinning: true })
      customerSave({ ...value }).then(res => {
        this.setState({ customerspinning: false })
        if (!res) return
        message.success('操作成功')
        this.setState({ visible_addCustomer: false })
        this.child.handleRest()
        this.fetch()
      })
    } else if (type === 'search') {
      let { pagination } = this.state;
      if (!Object.keys(value).length) {
        pagination = {
          current: 1,
          pageSize: 10
        }
      }
      this.setState({ pagination }, () => {
        this.fetch(value)
      })
    } else if (type === 'address') {
      const { area, ...rest } = value
      const { basicCustomerInfo, activeOperation, addressDetail } = this.state;
      let url = customerAddrSave
      let data = {
        ...rest,
        isDefault: value.isDefault ? 1 : 0,
        customerProvince: area[0],
        customerCity: area[1],
        customerArea: area[2],
        basicCustomerInfoId: basicCustomerInfo.id,
        basicCustomerInfoCode: basicCustomerInfo.customerCode
      }
      if (activeOperation === '修改地址') {
        url = customerAddrUpdate
        data.id = addressDetail.id
      }
      this.setState({ visible_operation: true, spinning: true })
      url(data).then(res => {
        this.setState({ spinning: false })
        if (!res) return
        message.success('操作成功')
        this.setState({ visible_operation: false, addressDetail: {} })
        this.showAddress(basicCustomerInfo)
        this.operation_child.handleRest()
      })
    }
  }


  handleCancel = type => {
    if (type === 'visible_operation') {
      this.setState({ visible_operation: false })
    } else {
      this.setState({ visible_addCustomer: false, visible_address: false })
    }
  }


  handleTableChange = (pagination, filters, sorter) => {
    this.setState({
      pagination
    }, () => {
      this.fetch()
    })
  }


  fetch = (json) => {
    this.setState({ loading: true })
    let { search, pathname } = this.props.history.location
    let { current, pageSize, ...rest } = parse(search.slice(1))
    let { dataSource, pagination } = this.state;
    if (!Object.keys(pagination).length) {
      pagination = {
        current: Number(current) || 1,
        pageSize: Number(pageSize) || 10
      }
      this.setState({ pagination })
    }
    let data = {};
    if (json) {
      data = { ...pagination, ...json };
    } else {
      data = { ...pagination, ...rest };
    }

    delete data.total;
    this.props.history.replace(`${pathname}?${stringify(data)}`)
    data.pageNum = data.current;
    delete data.current;

    customerList(data).then(res => {
      this.setState({ loading: false })
      if (!res) return
      dataSource = res.data.list || []
      pagination.total = res.data.total
      this.setState({
        dataSource,
        pagination,
      })
    })
  }


  showAddCustomer = () => {
    this.setState({ visible_addCustomer: true })
  }


  showAddress = record => {
    this.setState({ visible_address: true, address_loading: true })
    customerAddrList({ basicCustomerInfoId: record.id }).then(res => {
      this.setState({ address_loading: false })
      if (!res) return
      let address_dataSource = res.data.map((item, index) => {
        item.area = `${item.customerProvince}/${item.customerCity}/${item.customerArea}`
        return item
      })
      this.setState({
        address_dataSource,
        basicCustomerInfo: record
      })
    })
  }


  handleOk = e => {
    this.child.handleSubmit(e)
  }

  ref = res => {
    this.child = res
  }

  operationRef = res => {
    this.operation_child = res
  }


  showAddAddress = () => {
    this.setState({ visible_operation: true, activeOperation: '新增地址' })
  }


  deleteAndSettings = (type, value) => {
    let { basicCustomerInfo } = this.state;
    this.setState({ spinning: true })
    if (type === "set") {
      customerAddrDefault({ id: value.id }).then(res => {
        this.setState({ spinning: false })
        if (!res) return
        message.success('操作成功')
        this.showAddress(basicCustomerInfo)
      })
    } else if (type === 'customerDelete') {
      customerDel(value.customerCode).then(res => {
        this.setState({ spinning: false })
        if (!res) return
        message.success('操作成功')
        this.fetch()
      })
    }
  }


  operationAddress = (value) => {
    this.setState({ visible_operation: true, addressDetail: value, activeOperation: '修改地址' })
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return
    }
  }

  render() {
    const { dataSource, visible_addCustomer, loading, pagination, addressDetail, spinning, customerspinning, visible_address, activeOperation, visible_operation, address_dataSource, address_loading } = this.state
    const columns = _.cloneDeep(indexTableColumnsConfig).map(v => {
      if (v.render === '') {
        v.render = (ext, record, index) => {
          return (
            <span className="Dropdown_Menu_box">
              <span onClick={this.showAddress.bind(this, record)}>维护地址</span>
              <Popconfirm title="确定要删除吗?" onConfirm={this.deleteAndSettings.bind(this, 'customerDelete', record)}>
                <span>删除</span>
              </Popconfirm>
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
                  <span onClick={this.operationAddress.bind(this, record)}>修改</span>
                  <Popconfirm title="确定要删除吗?" onConfirm={this.deleteAndSettings.bind(this, 'delete', record)}>
                    <span> 删除</span>
                  </Popconfirm>
                </span>
              )}
              {
                v.renderType === 'tag' && (
                  <span className="Dropdown_Menu_box">
                    {
                      record.isDefault !== 1 &&
                      <Popconfirm title="确定要将此地址设为默认地址吗?" onConfirm={this.deleteAndSettings.bind(this, 'set', record)}>
                        <span>设为默认</span>
                      </Popconfirm>
                    }
                    {
                      record.isDefault === 1 &&
                      <Tag color="volcano">默认地址</Tag>
                    }
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
        <SearchForm
          selectWordsArr={['客户名称', '负责人', '手机']}
          onSubmit={this.onSubmit.bind(this, 'search')} />
        <div className="Customer_addBtn">
          <Button type="primary" onClick={this.showAddCustomer}>
            新增客户
          </Button>
        </div>

        <FetchTable
          dataSource={dataSource}
          columns={columns}
          useIndex={true}
          loading={loading}
          pagination={pagination}
          onChange={this.handleTableChange} />

        <Modal
          title="新增客户"
          okText="保存"
          centered={true}
          bodyStyle={{ paddingBottom: 0 }}
          visible={visible_addCustomer}
          onCancel={this.handleCancel}
          onOk={this.handleOk}>
          <Spin tip="Loading..." spinning={customerspinning}>
            <AddForm
              onRef={this.ref}
              onSubmit={this.onSubmit.bind(this, 'add')} />
          </Spin>
        </Modal>

        <Modal
          title="维护地址"
          width={1000}
          centered={true}
          bodyStyle={{ paddingBottom: 16 }}
          footer={null}
          onCancel={this.handleCancel}
          visible={visible_address}>
          <div className="alert_Btn">
            <Button type="primary" onClick={this.showAddAddress}>
              新增地址
            </Button>
          </div>
          <FetchTable
            dataSource={address_dataSource}
            useIndex={true}
            columns={address_columns}
            loading={address_loading}
            pagination={false} />
        </Modal>

        <Modal
          title={activeOperation}
          width={1000}
          destroyOnClose={true}
          centered={true}
          bodyStyle={{ paddingBottom: 16 }}
          footer={null}
          onCancel={this.handleCancel.bind(this, 'visible_operation')}
          visible={visible_operation}>
          <Spin tip="Loading..." spinning={spinning}>
            <AddressForm
              onRef={this.operationRef}
              addressDetail={addressDetail}
              onSubmit={this.onSubmit.bind(this, 'address')}
            />
          </Spin>
        </Modal>
      </div>
    )
  }
}
