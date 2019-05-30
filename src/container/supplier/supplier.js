import React from 'react'
import _ from 'lodash'
import { stringify, parse } from 'qs'
import SearchForm from './component/search'
import AddForm from './component/add'
import AddressForm from './component/address'
import FetchTable from '@component/fetchTable/fetchTable'
import { indexTableColumnsConfig, addressTableColumnsConfig } from './component/config'
import { Button, Modal, Tag, Spin, Popconfirm, message } from 'antd'
import { providerList, providerAdd, providerUpdate, providerAddrList, providerAddrSave, providerAddrUpdate } from 'api'
import fetchData from '@lib/request'
import './supplier.scss'

export default class Supplier extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      pagination: {},
      visible_addSupplier: false,
      visible_address: false,
      visible_operation: false,
      dataSource: [],
      activeOperation: '新增地址',
      address_dataSource: [],
      address_loading: false,
      spinning: false,
      supplierspinning: false,
      basicSupplierInfo: {},
      addressDetail: {},
      controlSupplier: null, // 当前操作的供应商
    }
  }


  componentDidMount() {
    this.fetch()
  }

  componentWillUnmount() {
    this.setState = () => { }
  }

  /** 列表查询 */
  fetch = (json) => {
    let { search, pathname } = this.props.history.location
    let { current, pageSize, ...rest } = parse(search.slice(1))
    let { dataSource, pagination } = this.state
    if (!Object.keys(pagination).length) {
      pagination = {
        current: Number(current) || 1,
        pageSize: Number(pageSize) || 10
      }
      this.setState({ pagination })
    }
    let data = {}
    if (json) {
      data = { ...pagination, ...json }
    } else {
      data = { ...pagination, ...rest }
    }

    delete data.total
    this.props.history.replace(`${pathname}?${stringify(data)}`)
    data.pageNum = data.current
    delete data.current
    this.setState({ loading: true })
    providerList(data).then(res => {
      this.setState({ loading: false })
      if (!res) return
      let { list, total } = res.data
      dataSource = list
      pagination.total = total
      this.setState({
        dataSource,
        pagination,
        loading: false,
      })
    })
  }

  onSubmit = (type, value) => {
    // 新增供应商 \ 修改供应商
    if (type === 'add' || type === 'modify') {
      this.setState({ supplierspinning: true })
      let api = type === 'add' ? providerAdd : providerUpdate
      api({ ...value }).then(res => {
        this.setState({ supplierspinning: false })
        if (!res) return
        message.success('操作成功')
        this.setState({ visible_addSupplier: false })
        this.child.handleRest()
        this.fetch()
      })
    }
    // 查询
    else if (type === 'search') {
      let { pagination } = this.state
      if (!Object.keys(value).length) {
        pagination = {
          current: 1,
          pageSize: 10
        }
      }
      this.setState({ pagination }, () => {
        this.fetch(value)
      })
    }
    else if (type === 'address') {
      const { area, ...rest } = value
      const { basicSupplierInfo, activeOperation, addressDetail } = this.state
      console.log(basicSupplierInfo)
      let api = providerAddrSave
      let data = {
        ...rest,
        isDefault: value.isDefault ? 1 : 0,
        providerProvince: area[0],
        providerCity: area[1],
        providerArea: area[2],
        providerId: basicSupplierInfo.id,
        // basicSupplierInfoCode: basicSupplierInfo.supplierCode
      }
      if (activeOperation === '修改地址') {
        api = providerAddrUpdate
        data.id = addressDetail.id
      }
      this.setState({ visible_operation: true, spinning: true })
      api(data).then(res => {
        this.setState({ spinning: false })
        if (!res) return
        message.success('操作成功')
        this.setState({ visible_operation: false, addressDetail: {} })
        this.showAddress(basicSupplierInfo)
        this.operation_child.handleRest()
      })
    }
  }


  handleCancel = type => {
    if (type === 'visible_operation') {
      this.setState({ visible_operation: false })
    } else {
      this.setState({ visible_addSupplier: false, visible_address: false })
    }
  }


  handleTableChange = (pagination, filters, sorter) => {
    this.setState({
      pagination
    }, () => {
      this.fetch()
    })
  }

  /** 修改\添加供应商 表单显示 */
  showAddSupplier = (item) => {
    this.setState({ visible_addSupplier: true, controlSupplier: item })
  }

  showAddress = record => {
    this.setState({ visible_address: true, address_loading: true })
    providerAddrList({ providerId: record.id }).then(res => {
      this.setState({ address_loading: false })
      if (!res) return
      let address_dataSource = res.data.map((item, index) => {
        item.area = `${item.providerProvince}/${item.providerCity}/${item.providerArea}`
        return item
      })
      this.setState({
        address_dataSource,
        basicSupplierInfo: record
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
    let { basicSupplierInfo } = this.state
    this.setState({ spinning: true })
    let url = '/webApi/supplier/addr/del'
    if (type === "set") {
      url = '/webApi/supplier/addr/default'
    } else if (type === 'supplierDelete') {
      url = '/webApi/supplier/del'
    }
    fetchData({
      url,
      method: 'get',
      data: {
        id: value.id
      }
    }).then(res => {
      message.success('操作成功')
      this.setState({ spinning: false })
      if (type !== 'supplierDelete') {
        this.showAddress(basicSupplierInfo)
      } else {
        this.fetch()
      }
    }).catch(err => {
      this.setState({ spinning: false })
    })
  }


  operationAddress = (value) => {
    this.setState({ visible_operation: true, addressDetail: value, activeOperation: '修改地址' })
  }

  render() {
    const { dataSource, visible_addSupplier, controlSupplier, loading, pagination, addressDetail, spinning, supplierspinning, visible_address, activeOperation, visible_operation, address_dataSource, address_loading } = this.state
    const columns = _.cloneDeep(indexTableColumnsConfig).map(v => {
      if (v.render === '') {
        v.render = (ext, record, index) => {
          return (
            <span className="Dropdown_Menu_box">
              <span onClick={this.showAddSupplier.bind(this, record)}>修改</span>
              <span onClick={this.showAddress.bind(this, record)}>维护地址</span>
              {/* <Popconfirm title="确定要删除吗?" onConfirm={this.deleteAndSettings.bind(this, 'supplierDelete', record)}>
                <span>删除</span>
              </Popconfirm> */}
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
      <div className="Supplier">
        <SearchForm
          selectWordsArr={['供应商名称', '负责人', '手机']}
          onSubmit={this.onSubmit.bind(this, 'search')} />
        <div className="Supplier_addBtn">
          <Button type="primary" onClick={this.showAddSupplier.bind(this, null)}>
            新增供应商
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
          title={controlSupplier ? '修改供应商' : '新增供应商'}
          okText="保存"
          centered={true}
          bodyStyle={{ paddingBottom: 0 }}
          visible={visible_addSupplier}
          onCancel={this.handleCancel}
          onOk={this.handleOk}>
          <Spin tip="Loading..." spinning={supplierspinning}>
            <AddForm
              onRef={this.ref}
              supplier={controlSupplier}
              onSubmit={this.onSubmit.bind(this)} />
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
