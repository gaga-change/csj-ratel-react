import React from 'react'
import { Form, Input, Button, Row, Col, Select } from 'antd'
import { warehouseList } from 'api'
import './form.scss'

const Option = Select.Option

class CommodityForm extends React.Component {

  state = {
    warehouseListLoading: false,
    warehouseList: []
  }

  componentDidMount() {
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

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        for (let i in values) {
          if (Array.isArray(values[i]) && !values[i].length) {
            delete values[i]
          } else if ([undefined, 'undefined', ''].includes(values[i])) {
            delete values[i]
          }
        }
        this.props.onSubmit(values)
      }
    })
  }

  handleRest = () => {
    this.props.form.resetFields()
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { warehouseListLoading, warehouseList } = this.state
    return (
      <div className="CommodityForm">
        <Form onSubmit={this.handleSubmit} layout="inline">
          <Row gutter={24}>

            <Col span={6} style={{ width: '292px', marginBottom: '12px' }}>
              <Form.Item label="仓库名称">
                {getFieldDecorator('warehouseCode', {
                  rules: [{ required: false, message: '' }],
                })(
                  <Select style={{ width: 180 }} placeholder="请选择仓库" loading={warehouseListLoading}>
                    {
                      warehouseList.map(v => <Option key={v.key} value={v.key}>{v.value}</Option>)
                    }
                  </Select>
                )}
              </Form.Item>
            </Col>

            <Col span={6} style={{ width: '292px', marginBottom: '12px' }}>
              <Form.Item label="商品名称">
                {getFieldDecorator('skuName', {
                  initialValue: '',
                  rules: [{ required: false, message: '' }],
                })(
                  <Input autoComplete='off' placeholder="请输入商品名称" />
                )}
              </Form.Item>
            </Col>

            <Col span={6} style={{ width: '400px', marginBottom: '12px' }}>
              <Form.Item label="货主商品编码">
                {getFieldDecorator('ownerSkuCode', {
                  initialValue: '',
                  rules: [{ required: false, message: '' }],
                })(
                  <Input autoComplete='off' placeholder="请输入货主商品编码" />
                )}
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item>
                <Button
                  type="primary"
                  style={{ marginRight: '12px' }}
                  htmlType="submit">
                  查询
                  </Button>
                <Button
                  type="primary"
                  onClick={this.handleRest}
                  htmlType="submit">
                  重置
                  </Button>
              </Form.Item>
            </Col>

          </Row>
        </Form>
      </div>)
  }
}

export default Form.create({ name: 'CommodityForm' })(CommodityForm)
