import React from 'react';
import { Form, Icon, Input } from 'antd';
import './form.scss'

class NormalLoginForm extends React.Component {
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
          <h3>用户登录</h3>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator('username', {
                rules: [{ required: true, message: '请输入用户名!' }],
              })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
              )}
            </Form.Item>

            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入用密码' }],
              })(
                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
              )}
            </Form.Item>

            <Form.Item>
               <div  className="loginBtn"  onClick={this.handleSubmit}>登录</div>
            </Form.Item>
          </Form> 
      </div>);
  }
}

export default Form.create({ name: 'normal_login' })(NormalLoginForm);
