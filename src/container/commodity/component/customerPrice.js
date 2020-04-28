import React from 'react'
import { Form, Select, Row, Col, InputNumber, Table, Button, Divider, message, Popconfirm, Modal } from 'antd'
import { commondityCustomerPriceColums } from 'config/table'
import { customerList, skuInfoSelectCustDetail } from 'api'

const { Option } = Select

/** 表单组件 */
class DataForm extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    customerList: [], // 客户列表
    customerListLoading: true, // 客户列表加载状态
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
    this.initData()
  }

  componentWillUnmount() {
    this.setState = () => { }
  }

  /** 相关数据初始加载 */
  initData() {
    customerList({ pageSize: 9999999 }).then(res => {
      this.setState({ customerListLoading: false })
      if (!res) return
      this.setState({ customerList: res.data.list })
    })
  }

  /** 添加|修改 表单提交 */
  handleSubmit = (e, cb) => {
    e && e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { customerList } = this.state
        let params = { ...values }
        // 提取客户名称 和 code
        let customerCode = params.customerCode
        delete params.customerCode
        let item = customerList.find(v => v.customerCode === customerCode)
        params.customerCode = item.customerCode
        params.customerName = item.customerName
        this.props.onSubmit && this.props.onSubmit(params)
        cb && cb(params)
        // this.handleReset()
      }
    })
  }

  handleReset = () => {
    this.props.form.resetFields()
  }

  render() {
    const { record = {} } = this.props
    const { getFieldDecorator } = this.props.form
    const { customerList, customerListLoading } = this.state
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    }

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        {
          this.props.visible && <Row>
            <Col span={12}>
              <Form.Item
                label="客户"
              >
                {getFieldDecorator('customerCode', {
                  rules: [{ required: true, message: '请选择客户!' }],
                  initialValue: record.customerCode
                })(
                  <Select
                    loading={customerListLoading}
                    showSearch
                    placeholder="请选择客户"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {customerList.map(v =>
                      <Option key={v.id} value={v.customerCode}>{v.customerName}</Option>
                    )}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="客户销价"
              >
                {getFieldDecorator('sellPrice', {
                  rules: [{ required: true, message: '请输入销售价!' }],
                  initialValue: record.sellPrice
                })(
                  <InputNumber min={0.01} max={99999999} placeholder="请输入销售价" style={{ width: '100%' }} precision={2} />
                )}
              </Form.Item>
            </Col>
            {
              !this.props.noAdd && <Col span={12}>
                <Form.Item {...tailFormItemLayout}>
                  <Button type="primary" htmlType="submit">
                    添加</Button>
                </Form.Item>
              </Col>
            }
          </Row>

        }</Form>
    )
  }
}

const WrappedDataForm = Form.create({ name: 'register' })(DataForm)

class CustomerPrice extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      tableDataLoading: false,
      modifyModalVisiable: false, // 修改销售价的表单 是否显示
    }
    this.skuCode = null
    this.Columns = [...commondityCustomerPriceColums]
    this.Columns.push({
      title: '操作',
      dataIndex: 'control',
      render: (text, record) => <span>
        <Popconfirm title="是否确认删除？" okText="是" cancelText="否" onConfirm={this.handleDel.bind(this, record)}>
          <button className="btn-link">删除</button>
        </Popconfirm>
        <Divider type="vertical" />
        <button className="btn-link" onClick={this.showModifyModal.bind(this, record)}>修改</button>
      </span>
    })
  }

  componentDidMount() {
    this.initData()
    this.props.onRef(this)
  }

  componentWillUnmount() {
    this.setState = () => { }
  }

  componentDidUpdate(props) {
    let newCode = this.props.record && this.props.record.skuCode
    let oldCode = props.record && props.record.skuCode

    if (newCode !== oldCode) {
      this.initData()
    }
  }

  /** 相关数据初始化 */
  initData() {
    if (!this.props.record) return
    this.setState({ tableDataLoading: true })
    skuInfoSelectCustDetail({ skuCode: this.props.record.skuCode }).then(res => {
      this.setState({ tableDataLoading: false })
      if (!res) return
      res.data.forEach((v, index) => v.index = index + 1)
      this.setState({ dataSource: res.data })
    })
  }

  handleReset() {
    this.setState({ dataSource: [], modifyModalVisiable: false })
    this.modifyForm && this.modifyForm.handleReset()
    this.addForm && this.addForm.handleReset()
  }

  /** 显示修改销售价 表单 */
  showModifyModal = item => {
    this.setState({ modifyModalVisiable: true, controlRecord: item })
  }

  /** 修改销售价 表单确认 */
  handleModifyConfirm = item => {
    this.modifyForm.handleSubmit(null, item => {
      const { dataSource, controlRecord } = this.state
      let temp = dataSource.find(v => v.customerCode === item.customerCode && v.customerCode !== controlRecord.customerCode)
      if (temp) {
        return message.warning('该客户已存在销售价！')
      }
      Object.assign(controlRecord, item)
      this.setState({ dataSource, modifyModalVisiable: false })
      this.modifyForm.handleReset()
    })
  }
  /** 修改销售价 表单取消  */
  handleModifyCancel = item => {
    this.setState({ modifyModalVisiable: false })
  }

  /** 添加销售价 */
  addData = item => {
    const { dataSource } = this.state
    let temp = dataSource.find(v => v.customerCode === item.customerCode)
    if (temp) {
      return message.warning('该客户已存在销售价！')
    }
    this.addForm.handleReset()
    item.index = dataSource.length + 1
    dataSource.push(item)
    this.setState({ dataSource })
  }

  /** 删除销售价 */
  handleDel = item => {
    const { dataSource } = this.state
    dataSource.splice(item.index - 1, 1)
    dataSource.forEach((v, index) => v.index = index + 1)
    this.setState({ dataSource })
  }

  /** 绑定 添加销售价表单组件 */
  addForm = child => this.addForm = child
  /** 绑定修改销售价表单组件 */
  onModifyForm = child => this.modifyForm = child
  render() {
    const { dataSource, modifyModalVisiable, controlRecord, tableDataLoading } = this.state
    return (
      <div>
        <div>
          <WrappedDataForm onSubmit={this.addData} onRef={this.addForm} visible={true} />
        </div>
        <div>
          <Table loading={tableDataLoading} dataSource={dataSource} rowKey="index" columns={this.Columns} size="small" />
        </div>
        <Modal
          title="修改销售价"
          width={800}
          okText="保存"
          centered={true}
          bodyStyle={{ paddingBottom: 16 }}
          onCancel={this.handleModifyCancel}
          onOk={this.handleModifyConfirm}
          visible={modifyModalVisiable}>
          <WrappedDataForm record={controlRecord} onRef={this.onModifyForm} noAdd={true} visible={modifyModalVisiable} />
        </Modal>
      </div>
    )
  }
}

export default CustomerPrice