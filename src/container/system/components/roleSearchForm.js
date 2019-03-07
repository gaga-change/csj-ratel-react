import React from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
class RoleForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit(values)
      }
    })
  }

  handleRest = () => {
    this.props.form.resetFields()
    this.props.onSubmit({})
  }

  render () {
    const { getFieldDecorator } = this.props.form;
    
    return (
      <div className="RoleForm b-1 mb-12 p-12">
        <Form onSubmit={this.handleSubmit} layout="inline">
          <Row gutter={24}>
            <Col span={6} style={{ width: '292px', marginBottom: '12px' }}>
              <Form.Item label="角色名称">
                {getFieldDecorator('roleName', {
                  initialValue: '',
                  rules: [{ required: false, message: '' }],
                })(
                  <Input autoComplete='off' placeholder="请输入角色名称" />
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

export default Form.create({ name: 'RoleForm' })(RoleForm)
