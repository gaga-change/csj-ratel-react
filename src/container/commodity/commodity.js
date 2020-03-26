import React from 'react'
import { Button, Modal, message, Popconfirm } from 'antd'
import { stringify, parse } from 'qs'
import FetchTable from '../../component/fetchTable/fetchTable'
import { commondityColumns } from 'config/table'
import CommodityForm from './component/form'
import AddForm from './component/addform'
import { skuInfoList, skuInfoUpdate, skuInfoAdd, skuInfoDel, skuInfoAddSkuPro, skuInfoAddSkuCustomer } from 'api'
import SupplyPrice from './component/supplyPrice'
import CustomerPrice from './component/customerPrice'
import { connect } from 'react-redux'
import './commodity.scss'

const { confirm } = Modal

class Commodity extends React.Component {

  constructor(props) {
    super(props)
    let columns = [...commondityColumns]
    let controlRow = columns.pop()
    controlRow = { ...controlRow }
    controlRow.render = (ext, record, index) => {
      return <span className="Dropdown_Menu_box">
        <Popconfirm title="确定要删除吗?" onConfirm={this.deleteCommodity.bind(this, record)}>
          <span data-rule-id="commodity-delete">删除</span>
        </Popconfirm>
        {/* <span data-rule-id="commodity-modify" onClick={this.modifySku.bind(this, record)}>编辑</span> */}
        <span data-rule-id="commodity-supplyPrice" onClick={this.modifySupplyPrice.bind(this, record)}>供货价</span>
        <span data-rule-id="commodity-customerPrice" onClick={this.modifyCustomerPrice.bind(this, record)}>销售价</span>
      </span>
    }
    columns.push(controlRow)
    this.columns = columns

    this.state = {
      dataSource: [],
      pagination: {},
      submitLoding: false,
      loading: false,
      visible: false,
      nowRow: null,
      modifySupplyPriceVisible: false, // 需改供货价表单是否显示
      controlSupplyRecord: null, // 当前操作的行数据
      skuInfoAddSkuProLoading: false,
      skuInfoAddSkuCustomerLoading: false
    }
  }

  componentDidMount() {
    this.fetch()
  }

  componentWillUnmount() {
    this.setState = () => { }
  }

  fetch = (json) => {
    this.setState({ loading: true })
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
    skuInfoList(data).then(res => {
      this.setState({
        loading: false,
      })
      if (!res) return
      let { data } = res
      dataSource = data.list
      pagination.total = data.total
      this.setState({
        dataSource,
        pagination,
      })
    })
  }

  /** 翻页 */
  handleTableChange = (pagination, filters, sorter) => {
    this.setState({
      pagination
    }, () => {
      this.fetch()
    })
  }

  /** 创建sku */
  handleCreateSku = (value) => {
    const { nowRow } = this.state
    let api = nowRow ? skuInfoUpdate : skuInfoAdd
    if (nowRow) {
      value.skuCode = nowRow.skuCode
      value.id = nowRow.id
    }
    this.setState({ submitLoding: true })
    value.isCheck = true
    api(value).then(res => {
      this.setState({
        submitLoding: false
      })
      if (!res) return

      if (res.code === 'ratel-40620008') {
        confirm({
          title: `商品名称【${value.skuName}】已存在，是否继续？`,
          onOk: () => {
            this.setState({ submitLoding: true })
            value.isCheck = false
            api(value).then(res => {
              this.setState({
                submitLoding: false
              })
              if (!res) return
              message.success('操作成功')
              this.fetch()
              this.child.handleRest()
              this.setState({ visible: false })
            })
          },
          onCancel() {
          },
        })
      } else {
        message.success('操作成功')
        this.fetch()
        this.child.handleRest()
        this.setState({ visible: false })
      }
    })
  }

  /** 搜索 */
  handleSearch = (value) => {
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

  /** 显示sku表单 */
  handleShowSkuForm = () => {
    this.setState({ nowRow: null, visible: true })
  }

  modifySku = (row) => {
    this.setState({ nowRow: row, visible: true })
  }

  /** 取消显示表单 */
  handleCancel = () => {
    this.modifyprice_child && this.modifyprice_child.handleRest()
    this.setState({ visible: false, modifySupplyPriceVisible: false, modifyCustomerPriceVisible: false })
  }

  /** 确定 */
  handleOk = (e) => {
    this.child.handleSubmit(e)
  }

  ref = (res) => {
    this.child = res
  }

  /** 删除商品 */
  deleteCommodity = (value) => {
    const { user } = this.props
    const { ownerCode } = user || {}
    skuInfoDel(ownerCode, value.skuCode).then(res => {
      if (!res) return
      message.success('操作成功')
      this.fetch()
    })
  }

  /** 修改供货价 按钮点击 */
  modifySupplyPrice = item => {
    this.setState({
      modifySupplyPriceVisible: true,
      controlSupplyRecord: item
    })
  }

  /** 修改销售价 按钮点击 */
  modifyCustomerPrice = item => {
    this.setState({
      modifyCustomerPriceVisible: true,
      controlCustomerRecord: item
    })
  }

  /** 供货价数据 确认提交 */
  handleSupplyPriceSubmit = () => {
    let { dataSource } = this.supplyPrice.state
    let { controlSupplyRecord } = this.state
    dataSource = JSON.parse(JSON.stringify(dataSource))
    dataSource.forEach(v => {
      delete v.index
      v.skuCode = controlSupplyRecord.skuCode
      v.skuName = controlSupplyRecord.skuName
    })
    this.setState({ skuInfoAddSkuProLoading: true })
    skuInfoAddSkuPro({ skuCode: controlSupplyRecord.skuCode, skuProviderInfoReqList: dataSource }).then(res => {
      this.setState({ skuInfoAddSkuProLoading: false })
      if (!res) return
      message.success('操作成功')
      this.supplyPrice && this.supplyPrice.handleReset()
      this.setState({ modifySupplyPriceVisible: false, controlSupplyRecord: null })
    })
  }

  /** 销售价数据  确认提交 */
  handleCustomerPriceSubmit = () => {
    let { dataSource } = this.customerPrice.state
    let { controlCustomerRecord } = this.state
    dataSource = JSON.parse(JSON.stringify(dataSource))
    dataSource.forEach(v => {
      delete v.index
      v.skuCode = controlCustomerRecord.skuCode
      v.skuName = controlCustomerRecord.skuName
    })
    this.setState({ skuInfoAddSkuCustomerLoading: true })
    skuInfoAddSkuCustomer({ skuCode: controlCustomerRecord.skuCode, skuCustomerReqList: dataSource }).then(res => {
      this.setState({ skuInfoAddSkuCustomerLoading: false })
      if (!res) return
      message.success('操作成功')
      this.customerPrice && this.customerPrice.handleReset()
      this.setState({ modifyCustomerPriceVisible: false, controlCustomerRecord: null })
    })
  }

  onSupplyPrice = child => this.supplyPrice = child
  onCustomerPrice = child => this.customerPrice = child
  render() {
    const { dataSource,
      submitLoding,
      visible,
      loading,
      pagination,
      modifySupplyPriceVisible,
      controlSupplyRecord,
      modifyCustomerPriceVisible,
      controlCustomerRecord,
      skuInfoAddSkuProLoading,
      skuInfoAddSkuCustomerLoading
    } = this.state

    return (
      <div className="Commodity"  >
        <CommodityForm
          selectWordsArr={['商品名称', '货主商品编码']}
          onSubmit={this.handleSearch} />
        <div className="alert_Btn">
          <Button data-rule-id="commodity-create" type="primary" onClick={this.handleShowSkuForm}>创建商品</Button>
        </div>
        <FetchTable
          dataSource={dataSource}
          columns={this.columns}
          loading={loading}
          pagination={pagination}
          onChange={this.handleTableChange} />
        <Modal
          title={this.state.nowRow ? '修改商品' : '创建商品'}
          okText="保存"
          width={800}
          centered={true}
          confirmLoading={submitLoding}
          bodyStyle={{ paddingBottom: 16 }}
          visible={visible}
          onCancel={this.handleCancel}
          onOk={this.handleOk}>
          <AddForm
            onRef={this.ref}
            row={this.state.nowRow}
            visible={visible}
            onSubmit={this.handleCreateSku} />
        </Modal>
        <Modal
          title="供货价"
          width={800}
          okText="保存"
          centered={true}
          bodyStyle={{ paddingBottom: 16 }}
          onCancel={this.handleCancel}
          onOk={this.handleSupplyPriceSubmit}
          visible={modifySupplyPriceVisible}
          confirmLoading={skuInfoAddSkuProLoading}>
          <SupplyPrice record={controlSupplyRecord} onRef={this.onSupplyPrice} />
        </Modal>
        <Modal
          title="销售价"
          width={800}
          okText="保存"
          centered={true}
          bodyStyle={{ paddingBottom: 16 }}
          onCancel={this.handleCancel}
          onOk={this.handleCustomerPriceSubmit}
          visible={modifyCustomerPriceVisible}
          confirmLoading={skuInfoAddSkuCustomerLoading}>
          <CustomerPrice record={controlCustomerRecord} onRef={this.onCustomerPrice} />
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user
})

export default connect(mapStateToProps)(Commodity)
