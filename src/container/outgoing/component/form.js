import React from 'react'
import { Form, Input, Button, Row, Col, Select, DatePicker } from 'antd'
import { billStatusEnum } from '@lib/enum'
import { warehouseList } from 'api'
import './form.scss'

const { RangePicker } = DatePicker
const Option = Select.Option

// @connect(
//   state => state.map
// )

class SelestForm extends React.Component {

  state = {
    warehouseList: [], // 仓库列表
    warehouseListLoading: true, // 仓库列表加载状态
  }

  componentDidMount() {
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
  }

  handleSubmit = (e) => {
    if (e) {
      e.preventDefault()
    }
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
    const { selectWordsArr = [], className = 'CommodityForm' } = this.props
    const { warehouseListLoading, warehouseList } = this.state
    return (
      <div className={className}>
        <Form onSubmit={this.handleSubmit} layout="inline">
          <Row gutter={24}>
            {
              selectWordsArr.includes('订单号') &&
              <Col span={6} style={{ width: '292px', marginBottom: '12px' }}>
                <Form.Item label="订单号">
                  {getFieldDecorator('busiBillNo', {
                    initialValue: '',
                    rules: [{ required: false, message: '' }],
                  })(
                    <Input autoComplete='off' placeholder="请输入订单号" />
                  )}
                </Form.Item>
              </Col>
            }

            {
              selectWordsArr.includes('商品名称') &&
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
            }

            {
              selectWordsArr.includes('状态') &&
              <Col span={6} style={{ width: '292px', marginBottom: '12px' }}>
                <Form.Item label="状态">
                  {getFieldDecorator('billStatus', {
                    rules: [{ required: false, message: '' }],
                  })(
                    <Select style={{ width: 180 }} placeholder="请选择状态">
                      {
                        billStatusEnum.map(v => <Option key={v.key} value={v.key}>{v.value}</Option>)
                      }
                    </Select>
                  )}
                </Form.Item>
              </Col>
            }

            {
              selectWordsArr.includes('客户名称') &&
              <Col span={6} style={{ width: '292px', marginBottom: '12px' }}>
                <Form.Item label="客户名称">
                  {getFieldDecorator('arrivalName', {
                    initialValue: '',
                    rules: [{ required: false, message: '' }],
                  })(
                    <Input autoComplete='off' placeholder="请输入客户名称" />
                  )}
                </Form.Item>
              </Col>
            }

            {
              selectWordsArr.includes('联系人电话') &&
              <Col span={6} style={{ width: '306px', marginBottom: '12px' }}>
                <Form.Item label="联系人电话">
                  {getFieldDecorator('arrivalLinkTel', {
                    rules: [{ required: false, message: '请输入正确格式的手机号', pattern: /^1[34578]\d{9}$/ }],
                  })(
                    <Input autoComplete='off' placeholder="请输入联系人电话" />
                  )}
                </Form.Item>
              </Col>
            }

            {
              selectWordsArr.includes('仓库') &&
              <Col span={6} style={{ width: '292px', marginBottom: '12px' }}>
                <Form.Item label="仓库">
                  {getFieldDecorator('warehouseCode', {
                    rules: [{ required: false, message: '' }],
                  })(
                    <Select style={{ width: 180 }} placeholder="请选择仓库" loading={warehouseListLoading}>
                      {warehouseList.map(v => <Option key={v.key} value={v.key}>{v.value}</Option>)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            }

            {
              selectWordsArr.includes('创建日期') &&
              <Col span={8} style={{ width: '458px', marginBottom: '12px' }}>
                <Form.Item label="创建日期">
                  {getFieldDecorator('createTime', {
                    rules: [{ type: 'array', required: false }],
                  })(
                    <RangePicker />
                  )}
                </Form.Item>
              </Col>
            }

            {
              selectWordsArr.includes('横向查询') &&
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
            }

            {
              selectWordsArr.includes('纵向查询') &&
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
            }
          </Row>
        </Form>
      </div>)
  }
}

export default Form.create({ name: 'SelestForm' })(SelestForm)
