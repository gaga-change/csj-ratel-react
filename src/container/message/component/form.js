import React from 'react'
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Row, Col, DatePicker } from 'antd';
import './form.scss'

const { RangePicker } = DatePicker;
class CommodityForm extends React.Component {

  state = {

  }

  componentDidMount() {
  }

  componentWillUnmount() { this.setState = () => { } }

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
    return (
      <div className="CommodityForm">
        <Form onSubmit={this.handleSubmit} layout="inline">
          <Row gutter={24}>

             <Col span={8} style={{ marginBottom: '12px', width: '458px' }}>
              <Form.Item label="创建日期">
                {getFieldDecorator('createTime', {
                  rules: [{ type: 'array', required: false }],
                })(
                  <RangePicker />
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
