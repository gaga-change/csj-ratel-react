import React from 'react'
import { Form, Input, Button, DatePicker, Select, Modal, message } from 'antd'
import moment from 'moment'
import _ from 'lodash'
import EditableTable from '@component/editableTable/editableTable'
import SelectionTable from '@component/selectionTable/selectionTable'
import { formTable_config, goodsInStorage_config, map_Config } from './config'
import SelestForm from './form'
import { stockList, custAddrList, custList, warehouseList } from 'api'
import './addform.scss'

const { TextArea } = Input
const Option = Select.Option

class AddForm extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      busiBillDetails: [],
      visible: false,
      goodsInStorage_dataSource: [],
      selectedRowKeys: [],
      arrival: {},
      arrivalConfig: [],
      arrivalAddressConfig: [],
      addSubmitLoading: false, // 提交加载状态
      warehouseListLoading: false,
      warehouseList: [],
      warehouse: {},
    }
  }

  componentDidMount() {
    let { record } = this.props
    let { arrival, busiBillDetails, selectedRowKeys } = this.state
    this.props.onRef(this)
    this.fetchArriva()
    if (record.arrivalCode) {
      arrival.arrivalName = record.arrivalName
      arrival.arrivalCode = record.arrivalCode
      if (Array.isArray(record.busiBillDetails)) {
        busiBillDetails = _.cloneDeep(record.busiBillDetails).map(v => {
          for (let i in map_Config) {
            if (map_Config[i] !== 'index') {
              v[map_Config[i]] = v[i]
            }
          }
          v.id = `${v.warehouseCode}_${v.skuCode}`
          return v
        })
      }
      selectedRowKeys = busiBillDetails.map(v => v.id)
      this.setState({
        arrival, busiBillDetails, selectedRowKeys, warehouse: {
          warehouseCode: record.warehouseCode,
          warehouseName: record.warehouseName
        }
      })
      this.props.form.setFieldsValue({ busiBillDetails })
      this.custAddrListApi(arrival.arrivalCode, record.arrivalAddress)
    }
    this.initData()
  }

  /** 相关数据初始化 */
  initData() {
    // 获取仓库列表
    warehouseList().then(res => {
      this.setState({ warehouseListLoading: false })
      if (!res) return
      this.setState({ warehouseList: res.data })
    })
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys })
  }

  handleDelete = (record) => {
    let { selectedRowKeys } = this.state
    let busiBillDetails = this.props.form.getFieldValue('busiBillDetails')
    let selectedRowKeys_index = selectedRowKeys.findIndex(v => v === record.id)
    let items_index = busiBillDetails.findIndex(v => v.id === record.id)
    if (selectedRowKeys_index >= 0) {
      selectedRowKeys.splice(selectedRowKeys_index, 1)
    }
    if (items_index >= 0) {
      busiBillDetails.splice(items_index, 1)
    }
    this.setState({ selectedRowKeys, busiBillDetails })
    this.props.form.setFieldsValue({ busiBillDetails })
  }

  handleSubmit = (type, e) => {
    let { arrival, warehouse } = this.state
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err && !values.busiBillDetails.some(v => isNaN(v.skuOutQty))) {
        this.setState({ addSubmitLoading: true })
        this.props.onSubmit(type, { ...values, ...arrival, ...warehouse }).then(res => this.setState({ addSubmitLoading: false }))
      }
    })
  }

  handleRest = () => {
    this.props.form.resetFields()
    this.setState({ busiBillDetails: [], arrivalConfig: [], arrivalAddressConfig: [] })
  }

  editableTableChange = (data) => {
    this.setState({ busiBillDetails: data })
    this.props.form.setFieldsValue({ busiBillDetails: data })
  }

  handleCancel = () => {
    this.setState({ visible: false })
  }

  handleOk = () => {
    let { selectedRowKeys, goodsInStorage_dataSource } = this.state
    let selectedItems = this.props.form.getFieldValue('busiBillDetails')
    let newItems = []
    goodsInStorage_dataSource.forEach(item => {
      if (selectedRowKeys.includes(item.id)) {
        let index = selectedItems.findIndex(v => v.id === item.id)
        if (index >= 0) {
          newItems.push(selectedItems[index])
        } else {
          newItems.push(item)
        }
      }
    })
    this.setState({ visible: false, busiBillDetails: newItems })
    this.props.form.setFieldsValue({ busiBillDetails: newItems })
  }

  selectCommoddity = () => {
    let { goodsInStorage_dataSource } = this.state
    let { arrivalCode } = this.props.form.getFieldsValue(['arrivalCode'])
    if (!arrivalCode) {
      return message.warning('请先选择客户！')
    }
    let { warehouseCode } = this.props.form.getFieldsValue(['warehouseCode'])
    if (!warehouseCode) {
      return message.warning('请先选择计划出库仓库！')
    }
    this.setState({ visible: true })
    if (!goodsInStorage_dataSource.length) {
      this.getCommodity({ customerCode: arrivalCode, warehouseCode })
    }
  }

  onSelect = (value) => {
    let { arrivalCode } = this.props.form.getFieldsValue(['arrivalCode'])
    this.getCommodity({ ...value, customerCode: arrivalCode })
    this.setState({ selectedRowKeys: [] })
  }

  /** 获取客户列表 */
  fetchArriva = () => {
    let { arrivalConfig } = this.state
    if (arrivalConfig.length > 0) {
      return
    }
    custList().then(res => {
      if (!res) return
      this.setState({ arrivalConfig: res.data || [] })
    })
  }

  /** 客户切换事件 */
  onSelectOptionChange = (value, option) => {
    let { arrival } = this.state
    let options = option.props
    arrival.arrivalCode = options.value
    arrival.arrivalName = options.children
    this.setState({ arrival })
    this.custAddrListApi(arrival.arrivalCode)
    this.setState({ busiBillDetails: [], goodsInStorage_dataSource: [], selectedRowKeys: [] })
  }

  /** 地址切换事件 */
  arrivalAddressChange = (value) => {
    let { arrivalAddressConfig } = this.state
    let temp = arrivalAddressConfig.find(v => v.id === value)
    if (temp) {
      this.props.form.setFieldsValue({
        arrivalAddress: temp.arrivalAddress,
        arrivalLinkName: temp.receiverName,
        arrivalLinkTel: temp.receiverTel
      })
    }
  }

  /** 获取客户地址列表 */
  custAddrListApi = (basicCustomerInfoCode, address) => {
    let check = null
    custAddrList({ basicCustomerInfoCode }).then(res => {
      if (!res) return
      let arrivalAddressConfig = res.data.map(v => {
        v.arrivalAddress = `${v.customerCity}/${v.customerProvince}/${v.customerArea} ( 详细地址: ${v.customerAddress} )`
        if (address === v.arrivalAddress) {
          check = v
        }
        return v
      })
      this.setState({ arrivalAddressConfig })
      let temp = null
      if (check) {
        temp = check
      } else {
        temp = arrivalAddressConfig.find(v => v.isDefault === 1)
      }
      if (temp) {
        this.props.form.setFieldsValue({
          arrivalAddressId: temp.id,
          arrivalAddress: temp.arrivalAddress,
          arrivalLinkName: temp.receiverName,
          arrivalLinkTel: temp.receiverTel
        })
      } else {
        this.props.form.setFieldsValue({
          arrivalAddressId: '',
          arrivalAddress: '',
          arrivalLinkName: '',
          arrivalLinkTel: ''
        })
      }
    })
  }

  /** 获取商品 */
  getCommodity = (value = {}) => {
    this.setState({ selectionTableLoding: true })
    stockList(value).then(res => {
      this.setState({ selectionTableLoding: false })
      if (!res) return
      let goodsInStorage_dataSource = []
      goodsInStorage_dataSource = res.data.map(v => {
        v.id = `${v.warehouseCode}_${v.skuCode}`
        return v
      })
      this.setState({ goodsInStorage_dataSource })
    })
  }

  onFocus = (type) => {
    // this.props.form.validateFields([type], (errors, values) => {
    //   if (errors) {
    //     message.error('请先选择客户')
    //   } else {
    //     let { arrival } = this.state
    //     this.custAddrListApi(arrival.arrivalCode)
    //   }
    // })
  }

  /** 仓库切换事件 */
  handleWarehouseCodeChange = (value, option) => {
    let { warehouse } = this.state
    let options = option.props
    warehouse.warehouseCode = options.value
    warehouse.warehouseName = options.children
    this.setState({ warehouse })
    this.setState({ busiBillDetails: [], goodsInStorage_dataSource: [], selectedRowKeys: [] })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    let { warehouseListLoading, warehouseList, busiBillDetails, visible, arrivalConfig, arrivalAddressConfig, goodsInStorage_dataSource, selectedRowKeys, selectionTableLoding, addSubmitLoading } = this.state
    let { record } = this.props
    const formItemLayout_left = {
      labelCol: {
        span: 7
      },
      wrapperCol: {
        span: 17
      },
      style: {
        width: 300,
        height: 60
      }
    }

    const formItemLayout_arrivalAddress = {
      labelCol: {
        span: 2
      },
      wrapperCol: {
        span: 22
      },
      style: {
        width: '100%',
        height: 60
      }
    }

    const formItemLayout_right = {
      labelCol: {
        span: 8
      },
      wrapperCol: {
        span: 16
      },
      style: {
        width: 400,
      }
    }

    const formItemLayout_table = {
      labelCol: {
        span: 0
      },
      wrapperCol: {
        span: 24
      },
      style: {
        width: '100%',
        marginBottom: 12
      }
    }

    const formItemLayout_button = {
      style: {
        display: 'flex',
        justifyContent: 'flex-end'
      }
    }

    const columns = _.cloneDeep(formTable_config).map(v => {
      if (v.render === '') {
        v.render = (ext, record, index) => {
          return <span className="Dropdown_Menu_box">
            <span onClick={this.handleDelete.bind(this, record)}>删除</span>
          </span>
        }
      }
      return v
    })


    const checkArrivalAddress = (rule, value, callback) => {
      if (!this.props.form.getFieldValue('arrivalCode')) {
        callback('请先选择客户')
      } else {
        callback()
      }
    }

    const filterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
    return (
      <div className="AddForm">
        <Form
          layout="inline"
          onSubmit={this.handleSubmit} >
          <Form.Item label="订单号" {...formItemLayout_left}>
            {getFieldDecorator('busiBillNo', {
              initialValue: record.busiBillNo,
              rules: [{ required: true, message: '请输入订单号' },
              { pattern: /^[^\u4e00-\u9fa5]{0,}$/, message: '不能含有中文' }
              ],
            })(
              <Input autoComplete='off' placeholder="请输入订单号" maxLength={40} />
            )}
          </Form.Item>
          <Form.Item label="合同号" {...formItemLayout_right}>
            {getFieldDecorator('contractNo', {
              initialValue: record.contractNo
            })(
              <Input autoComplete='off' placeholder="请输入合同号" maxLength={40} />
            )}
          </Form.Item>
          <Form.Item label="客户名称"  {...formItemLayout_left} >
            {getFieldDecorator('arrivalCode', {
              initialValue: record.arrivalCode,
              rules: [{ required: true, message: '请选择客户' }],
            })(
              <Select
                showSearch
                onFocus={this.fetchArriva}
                style={{ width: 180 }}
                filterOption={filterOption}
                placeholder="请选择客户"
                onChange={this.onSelectOptionChange}>
                {
                  arrivalConfig.map(v => <Option key={v.customerCode} value={v.customerCode}>{v.customerName}</Option>)
                }
              </Select>
            )}
          </Form.Item>

          <Form.Item label="计划出库日期"  {...formItemLayout_right} style={{ width: 400 }}>
            {getFieldDecorator('arrivalPreDate', {
              initialValue: (record.arrivalPreDate && !isNaN(record.arrivalPreDate) && moment(Number(record.arrivalPreDate))) || null,
              rules: [{ required: true, message: '请选择计划出库日期' }],
            })(
              <DatePicker />
            )}
          </Form.Item>

          <Form.Item label="计划出库仓库" {...formItemLayout_left} style={{ height: 60, width: 400 }}>
            {getFieldDecorator('warehouseCode', {
              initialValue: record.warehouseCode,
              rules: [{ required: true, message: '请选择计划出库仓库' }],
            })(
              <Select style={{ width: 180 }} placeholder="请选择计划出库仓库" onChange={this.handleWarehouseCodeChange} loading={warehouseListLoading}>
                {warehouseList.map(v => <Option key={v.key} value={v.key}>{v.value}</Option>)}
              </Select>
            )}
          </Form.Item>

          {/* 该组件为隐藏组件和下面显示的下拉框配合使用 */}
          <Form.Item label="收货地址" {...formItemLayout_arrivalAddress} style={{ height: 60, display: 'none' }}>
            {getFieldDecorator('arrivalAddress', {
              initialValue: record.arrivalAddress,
              rules: [{
                required: false,
                message: '请输入收货地址',
                validator: checkArrivalAddress
              }],
            })(
              <Input autoComplete='off' style={{ width: 620 }} placeholder="请输入收货地址" />
            )}
          </Form.Item>

          <Form.Item label="收货地址" {...formItemLayout_arrivalAddress} style={{ height: 60, display: 'block' }}>
            {getFieldDecorator('arrivalAddressId', {
              initialValue: '',
              rules: [{
                required: true,
                message: '请选择收货地址',
                validator: checkArrivalAddress
              }],
            })(
              <Select style={{ width: 620 }} onChange={this.arrivalAddressChange} placeholder="请选择收货地址" onFocus={this.onFocus.bind(this, 'arrivalAddressId')}>
                {
                  arrivalAddressConfig.map(v => <Option key={v.id} value={v.id}>{v.arrivalAddress}</Option>)
                }
              </Select>
            )}
          </Form.Item>

          <Form.Item label="收货人" {...formItemLayout_left}>
            {getFieldDecorator('arrivalLinkName', {
              initialValue: record.arrivalLinkName,
              rules: [{ required: false, message: '' }],
            })(
              <Input autoComplete='off' placeholder="请输入收货人" />
            )}
          </Form.Item>

          <Form.Item label="手机" {...formItemLayout_right} >
            {getFieldDecorator('arrivalLinkTel', {
              initialValue: record.arrivalLinkTel,
              rules: [{ required: false, message: '请输入正确格式的手机号', pattern: /^1[34578]\d{9}$/ }],
            })(
              <Input autoComplete='off' placeholder="请输入手机" />
            )}
          </Form.Item>

          <Form.Item label="备注" {...formItemLayout_left} style={{ width: 300, minHeight: 110 }}>
            {getFieldDecorator('remarkInfo', {
              initialValue: record.remarkInfo,
              rules: [{ required: false }],
            })(
              <TextArea rows={4} placeholder="请输入备注信息" />
            )}
          </Form.Item>

          <Form.Item  {...formItemLayout_table}>
            {getFieldDecorator('busiBillDetails', {
              initialValue: busiBillDetails,
              rules: [{ required: true, message: '该项为必填' }],
            })(
              <div className="form_item_table" style={{ width: '100%' }}>
                <div className="alert_Btn">
                  <Button type="primary" onClick={this.selectCommoddity}>选择出库商品</Button>
                </div>
                <EditableTable
                  pagination={false}
                  useIndex={true}
                  onChange={this.editableTableChange}
                  rowClassName={() => 'editable-row'}
                  columns={columns}
                  dataSource={busiBillDetails} />
              </div>
            )}
          </Form.Item>


          <Form.Item {...formItemLayout_button} >
            <Button
              className="mr20"
              type="primary"
              onClick={this.handleSubmit.bind(this, 'save')}
              loading={addSubmitLoading}
              htmlType="submit">
              保存
                  </Button>
            <Button
              type="primary"
              onClick={this.handleSubmit.bind(this, 'submit')}
              loading={addSubmitLoading}
              htmlType="submit">
              提交
                  </Button>
          </Form.Item>
        </Form>

        <Modal
          title="选择出库商品"
          centered={true}
          destroyOnClose={true}
          width={1000}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}>
          <div className="selectCommodityModal">
            <SelestForm
              className='CommodityFormArert'
              onSubmit={this.onSelect}
              selectWordsArr={['商品名称', '横向查询']} />
            <SelectionTable
              rowKey="id"
              pagination={{ pageSize: 10 }}
              selectedRowKeys={selectedRowKeys}
              loading={selectionTableLoding}
              onSelectChange={this.onSelectChange}
              dataSource={goodsInStorage_dataSource}
              columns={goodsInStorage_config} />
          </div>
        </Modal>
      </div>)
  }
}

export default Form.create({ name: 'AddForm' })(AddForm)
