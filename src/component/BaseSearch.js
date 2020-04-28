import React from 'react'
import { Form, Input, Row, Col, Select, Button } from 'antd'
import * as Enum from '@lib/enum'

const { Option } = Select

/*
 vertical = true // 默认确认按钮是垂直的
 onSubmit = Function // 提交回调参数
 const config = [
  { label: '质检单号', prop: 'orderCode' },
  { label: '创建时间', prop: 'createTimeArea', props: ['startDate', 'endDate'], type: 'timeArea' },
  { label: '库区性质', prop: 'warehouseAreaNature', type: 'enum', enum: 'warehouseAreaNatureEnum' },
]
 */
class BaseSearch extends React.Component {

  state = {
  }

  componentDidMount() {
    this.check()
  }

  /** 校验配置信息是否正确 */
  check() {
    const { config } = this.props
    config.forEach(item => {
      switch (item.type) {
        case 'enum':
          if (Enum[item.enum]) console.error(`枚举【${item.enum}】不存在`)
          break
        default:
          break
      }
    })
  }

  /** 提交信息 */
  handleSubmit = (e) => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit(values)
      }
    })
  }

  /** 重置表单 */
  handleRest = (e) => {
    this.props.form.resetFields()
    this.handleSubmit()
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { className = '', config, vertical = true } = this.props
    return (
      <div className={className}>
        <Form layout="inline">
          <Row gutter={24}>
            {
              config.map((item, index) => {
                if (item.type === 'enum') {
                  return <Col key={index} span={6} style={{ width: '292px', marginBottom: '12px' }}>
                    <Form.Item label={item.label}>
                      {getFieldDecorator(item.prop, {
                        rules: [{ required: false, message: '' }],
                      })(
                        <Select style={{ width: 180 }} placeholder={`请选择${item.label}`}>
                          {
                            (Enum[item.enum] || []).map(v => <Option key={v.key} value={v.key}>{v.value}</Option>)
                          }
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                } else {
                  return <Col key={index} span={6} style={{ width: '292px', marginBottom: '12px' }}>
                    <Form.Item label={item.label}>
                      {getFieldDecorator(item.prop, {
                        initialValue: undefined
                      })(
                        <Input maxLength={200} autoComplete='off' placeholder={`请输入${item.label}`} />
                      )}
                    </Form.Item>
                  </Col>
                }
              })
            }
            {
              !vertical &&
              <Form.Item>
                <Button
                  type="primary"
                  onClick={this.handleSubmit}
                  style={{ marginRight: '12px' }}
                  htmlType="button">
                  查询
                  </Button>
                <Button
                  type="primary"
                  onClick={this.handleRest}
                  htmlType="button">
                  重置
                   </Button>
              </Form.Item>
            }

            {
              vertical &&
              <Col span={24}>
                <Form.Item>
                  <Button
                    type="primary"
                    onClick={this.handleSubmit}
                    style={{ marginRight: '12px' }}
                    htmlType="button">
                    查询
                    </Button>
                  <Button
                    type="primary"
                    onClick={this.handleRest}
                    htmlType="button">
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

export default Form.create({ name: 'BaseSearch' })(BaseSearch)
