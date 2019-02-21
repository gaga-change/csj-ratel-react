import React from 'react';
import { Form, Input } from 'antd';

class CommodityForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit(values)
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="formContainer">
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator('username', {
                rules: [{ required: true, message: '请输入用户名!' }],
              })(
                <Input  placeholder="用户名" />
              )}
            </Form.Item>

            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入用密码' }],
              })(
                <Input  type="password" placeholder="密码" />
              )}
            </Form.Item>
          
          </Form> 
      </div>);
  }
}

export default Form.create({ name: 'normal_login' })(CommodityForm);
