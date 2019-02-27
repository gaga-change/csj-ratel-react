import React from 'react';
import { Form, Input, Button, Row, Col, Select } from 'antd';
const { Option } = Select;

class UserForm extends React.Component {

  constructor(props) {
    super(props)
    this.state = {

    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit(values)
      }
    })
  }

  handleRest = () => {
    this.props.form.resetFields();
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div className="UserForm b-1 mb-12 p-12">
        <Form onSubmit={this.handleSubmit} layout="inline">
          <Row gutter={24}>
            <Col span={6} style={{ width: '290px', marginBottom: '12px' }}>
              <Form.Item label="用户名">
                {getFieldDecorator('userName', {
                  initialValue: '',
                  rules: [{ required: false, message: '' }],
                })(
                  <Input autoComplete='off' placeholder="请输入用户名" />
                )}
              </Form.Item>
            </Col>
            <Col span={6} style={{ width: '290px', marginBottom: '12px' }}>
              <Form.Item label="手机">
                {getFieldDecorator('phone', {
                  initialValue: '',
                  rules: [{ required: false, message: '' }],
                })(
                  <Input autoComplete='off' placeholder="请输入手机号码" />
                )}
              </Form.Item>
            </Col>
            <Col span={6} style={{ width: '290px', marginBottom: '12px' }}>
              <Form.Item label="状态" >
                {getFieldDecorator('status', {
                  rules: [{ required: false, message: '' }],
                })(
                  <Select
                    style={{ width: 180 }} placeholder="请选择状态"
                  >
                    <Option value="1">启用</Option>
                    <Option value="0">禁用</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={6} style={{ width: '290px', marginBottom: '12px' }}>
              <Form.Item label="角色">
                {getFieldDecorator('role', {
                  rules: [{ required: false, message: '' }],
                })(
                  <Select
                    style={{ width: 180 }} placeholder="请选择角色"
                  >
                    <Option value="销售">销售</Option>
                    <Option value="采购">采购</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item>
                <Button
                  type="primary"
                  style={{ marginRight: '12px' }}
                  htmlType="submit"
                >查询</Button>
                <Button
                  type="primary"
                  htmlType="reset"
                  onClick={this.handleRest}
                >重置</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>)
  }
}

export default Form.create({ name: 'UserForm' })(UserForm)
