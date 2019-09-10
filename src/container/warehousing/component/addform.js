import React from 'react'
import { Form, Input, Button, DatePicker, Modal, Select, message } from 'antd'
import _ from 'lodash'
import moment from 'moment'
import EditableTable from '@component/editableTable/editableTable'
import SelectionTable from '@component/selectionTable/selectionTable'
import { planInGoodsListColums } from 'config/table'
import { formTable_config, map_Config } from './config'
import { warehouseList, providerList, selectSkuByProviderCode } from 'api'
import SelestForm from './form'
import './addform.scss'

const { TextArea } = Input
const Option = Select.Option

class AddForm extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      items: [],
      visible: false,
      goodsInStorage_dataSource: [],
      selectedRowKeys: [],
      selectionTableLoding: false,
      warehouse: {},
      warehouseList: [], // 仓库列表
      warehouseListLoading: true, // 仓库列表加载状态
      providerList: [], // 供应商列表
      providerListLoading: true, // 供应商列表加载状态
      addSubmitLoading: false, // 创建入库业务单按钮提交状态
    }
  }

  componentDidMount() {
    let { record } = this.props
    let { warehouse, items, selectedRowKeys } = this.state
    this.props.onRef(this)
    if (record.planWarehouseCode) {
      warehouse.warehouseName = record.planWarehouseName
      if (Array.isArray(record.planDetails)) {
        items = _.cloneDeep(record.planDetails).map(v => {
          for (let i in map_Config) {
            if (map_Config[i] !== 'index') {
              v[map_Config[i]] = v[i]
            }
          }
          v.id = v.skuCode
          return v
        })
      }
      selectedRowKeys = items.map(v => v.id)
      this.setState({ warehouse, items, selectedRowKeys })
      this.props.form.setFieldsValue({ items })
    }
    this.initData()
  }

  componentWillUnmount() { this.setState = () => { } }

  /** 相关数据初始化 */
  initData() {
    // 获取仓库列表
    warehouseList().then(res => {
      this.setState({ warehouseListLoading: false })
      if (!res) return
      this.setState({ warehouseList: res.data })
    })

    // 获取供应商列表
    providerList({ pageSize: 9999999 }).then(res => {
      this.setState({ providerListLoading: false })
      if (!res) return
      this.setState({ providerList: res.data.list })
    })
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys })
  }

  handleDelete = (record) => {
    let { selectedRowKeys } = this.state
    let items = this.props.form.getFieldValue('items')
    let selectedRowKeys_index = selectedRowKeys.findIndex(v => v === record.id)
    let items_index = items.findIndex(v => v.id === record.id)
    if (selectedRowKeys_index >= 0) {
      selectedRowKeys.splice(selectedRowKeys_index, 1)
    }
    if (items_index >= 0) {
      items.splice(items_index, 1)
    }
    this.setState({ selectedRowKeys, items })
    this.props.form.setFieldsValue({ items })
  }

  handleSubmit = (type, e) => {
    let { warehouse } = this.state
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err && !values.items.some(v => isNaN(v.planInQty))) {
        values = { ...values }
        values.providerName = this.state.providerList.find(v => v.providerCode === values.providerCode).providerName
        this.setState({ addSubmitLoading: true })
        this.props.onSubmit(type, { ...values, ...warehouse }).then(res => {
          this.setState({ addSubmitLoading: false })
        })
      }
    })
  }

  handleRest = () => {
    this.props.form.resetFields()
    this.setState({ items: [], selectedRowKeys: [] })
  }

  editableTableChange = (data) => {
    this.setState({ items: data })
    this.props.form.setFieldsValue({ items: data })
  }

  handleCancel = () => {
    this.setState({ visible: false })
  }

  handleOk = () => {
    let { selectedRowKeys, goodsInStorage_dataSource } = this.state
    let selectedItems = this.props.form.getFieldValue('items')
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
    this.setState({ visible: false, items: newItems })
    this.props.form.setFieldsValue({ items: newItems })
  }

  /** “选择入库商品” 按钮点击事件 */
  selectCommoddity = () => {
    let { providerCode } = this.props.form.getFieldsValue(['providerCode'])
    if (!providerCode) {
      return message.warning('请先选择供应商！')
    }
    let { goodsInStorage_dataSource } = this.state
    this.setState({ visible: true })
    if (!goodsInStorage_dataSource.length) {
      this.getCommodity({ providerCode })
    }
  }

  onSelect = (value) => {
    let { providerCode } = this.props.form.getFieldsValue(['providerCode'])
    this.getCommodity({ ...value, providerCode })
    this.setState({ selectedRowKeys: [] })
  }

  /** 获取（刷新）商品列表 */
  getCommodity = (value) => {
    value = value || {}
    this.setState({ selectionTableLoding: true })
    selectSkuByProviderCode(value).then(res => {
      this.setState({ selectionTableLoding: false })
      if (!res) return
      let goodsInStorage_dataSource = []
      goodsInStorage_dataSource = res.data.map(v => {
        v.id = v.skuCode
        return v
      })
      this.setState({ goodsInStorage_dataSource })
    })
  }

  onSelectOptionChange = (value, option) => {
    let { warehouse } = this.state
    let options = option.props
    warehouse.warehouseCode = options.value
    warehouse.warehouseName = options.children
    this.setState({ warehouse })
  }

  /** 供应商下拉选择 事件 */
  handleProviderSelectChange = (value, option) => {
    let item = this.state.providerList.find(v => v.providerCode === value)
    this.props.form.setFieldsValue({
      providerCode: item.providerCode
    })
    this.setState({ items: [], goodsInStorage_dataSource: [], selectedRowKeys: [] })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    let { items, visible, goodsInStorage_dataSource,
      selectedRowKeys,
      selectionTableLoding,
      warehouseListLoading,
      warehouseList,
      providerListLoading,
      providerList,
      addSubmitLoading
    } = this.state
    const { record } = this.props
    const formItemLayout_left = {
      labelCol: {
        span: 9
      },
      wrapperCol: {
        span: 15
      },
      style: {
        width: 300,
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
          <Form.Item label="计划入库仓库" {...formItemLayout_left}>
            {getFieldDecorator('warehouseCode', {
              initialValue: record.planWarehouseCode,
              rules: [{ required: true, message: '请选择计划入库仓库' }],
            })(
              <Select style={{ width: 180 }} placeholder="请选择计划入库仓库" onChange={this.onSelectOptionChange} loading={warehouseListLoading}>
                {warehouseList.map(v => <Option key={v.key} value={v.key}>{v.value}</Option>)}
              </Select>
            )}
          </Form.Item>

          <Form.Item label="计划入库日期"  {...formItemLayout_right}>
            {getFieldDecorator('planInTime', {
              initialValue: (record.planTime && !isNaN(record.planTime) && moment(Number(record.planTime))) || null,
              rules: [{ required: true, message: '请选择计划入库日期' }],
            })(
              <DatePicker />
            )}
          </Form.Item>
          <Form.Item label="供应商名称" {...formItemLayout_left}>
            {getFieldDecorator('providerName', {
              initialValue: record.providerName,
              rules: [{ required: true, message: '请输入供应商名称' }],
            })(
              <Select
                loading={providerListLoading}
                showSearch
                placeholder="请选择供应商"
                optionFilterProp="children"
                onChange={this.handleProviderSelectChange}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {providerList.map(v =>
                  <Option key={v.providerCode} value={v.providerCode}>{v.providerName}</Option>
                )}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="供应商编码" {...formItemLayout_right}>
            {getFieldDecorator('providerCode', {
              initialValue: record.providerCode,
            })(
              <Input autoComplete='off' placeholder="供应商编码(选择供应商名称自动带出)" readOnly={true} />
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
            {getFieldDecorator('items', {
              initialValue: items,
              rules: [{ required: true, message: '该项为必填' }],
            })(
              <div className="form_item_table">
                <div className="alert_Btn">
                  <Button type="primary" onClick={this.selectCommoddity}>选择入库商品</Button>
                </div>
                <EditableTable
                  pagination={false}
                  useIndex={true}
                  onChange={this.editableTableChange}
                  rowClassName={() => 'editable-row'}
                  columns={columns}
                  dataSource={items} />
              </div>
            )}
          </Form.Item>

          <Form.Item {...formItemLayout_button}>
            <Button
              type="primary"
              onClick={this.handleSubmit.bind(this, 'saveSubmit')}
              loading={addSubmitLoading}
              htmlType="submit">
              保存</Button>
            <Button
              className="ml20"
              type="primary"
              onClick={this.handleSubmit.bind(this, 'addSubmit')}
              loading={addSubmitLoading}
              htmlType="submit">
              提交</Button>
          </Form.Item>
        </Form>
        <Modal
          title="选择入库商品"
          centered={true}
          width={900}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}>
          <div className="selectCommodityModal">
            <SelestForm
              className='CommodityFormArert'
              onSubmit={this.onSelect}
              selectWordsArr={['商品名称', '查询']} />
            <SelectionTable
              rowKey="id"
              pagination={{ pageSize: 10 }}
              loading={selectionTableLoding}
              selectedRowKeys={selectedRowKeys}
              onSelectChange={this.onSelectChange}
              dataSource={goodsInStorage_dataSource}
              columns={planInGoodsListColums} />
          </div>
        </Modal>
      </div>)
  }
}

export default Form.create({ name: 'AddForm' })(AddForm)
