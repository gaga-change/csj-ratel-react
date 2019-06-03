import React from 'react'
import { Form, Input, Button, DatePicker, Modal, Select } from 'antd'
import _ from 'lodash'
import moment from 'moment'
import request from '@lib/request'
import EditableTable from '@component/editableTable/editableTable'
import SelectionTable from '@component/selectionTable/selectionTable'
import { formTable_config, map_Config, goodsInStorage_config } from './config'
import { warehouseList } from 'api'
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
      warehouseListLoading: false, // 仓库列表加载状态
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
    this.setState({ warehouseListLoading: true })
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
        this.props.onSubmit(type, { ...values, ...warehouse })
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

  selectCommoddity = () => {
    let { goodsInStorage_dataSource } = this.state
    this.setState({ visible: true })
    if (!goodsInStorage_dataSource.length) {
      this.getCommodity()
    }
  }

  onSelect = (value) => {
    this.getCommodity(value)
    this.setState({ selectedRowKeys: [] })
  }

  getCommodity = (value) => {
    this.setState({ selectionTableLoding: true })
    let json = {
      url: '/webApi/sku/info/select',
      method: 'get'
    }
    if (value) {
      json.data = value
    }
    request(json).then(res => {
      let goodsInStorage_dataSource = []
      if (Array.isArray(res)) {
        goodsInStorage_dataSource = _.cloneDeep(res).map(v => {
          v.id = v.skuCode
          return v
        })
      }
      this.setState({ selectionTableLoding: false, goodsInStorage_dataSource })
    }).catch(err => {
      this.setState({ selectionTableLoding: false })
    })
  }

  onSelectOptionChange = (value, option) => {
    let { warehouse } = this.state
    let options = option.props
    warehouse.warehouseCode = options.value
    warehouse.warehouseName = options.children
    this.setState({ warehouse })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    let { items, visible, goodsInStorage_dataSource,
      selectedRowKeys,
      selectionTableLoding,
      warehouseListLoading,
      warehouseList
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

          <Form.Item label="供应商编码" {...formItemLayout_left}>
            {getFieldDecorator('providerCode', {
              initialValue: record.providerCode,
              rules: [{ required: true, message: '请输入供应商编码' }],
            })(
              <Input autoComplete='off' placeholder="请输入供应商编码" />
            )}
          </Form.Item>

          <Form.Item label="供应商名称" {...formItemLayout_right}>
            {getFieldDecorator('providerName', {
              initialValue: record.providerName,
              rules: [{ required: true, message: '请输入供应商名称' }],
            })(
              <Input autoComplete='off' placeholder="请输入供应商名称" />
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
              style={{ marginRight: '12px' }}
              onClick={this.handleSubmit.bind(this, 'saveSubmit')}>
              保存
                    </Button>
            <Button
              type="primary"
              onClick={this.handleSubmit.bind(this, 'addSubmit')}
              htmlType="submit">
              提交
                    </Button>
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
              columns={goodsInStorage_config} />
          </div>
        </Modal>
      </div>)
  }
}

export default Form.create({ name: 'AddForm' })(AddForm)
