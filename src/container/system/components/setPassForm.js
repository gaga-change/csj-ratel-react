import React from 'react';
import {Form, Input,Button} from 'antd';
import './setPassForm.scss'

class SetPassForm extends React.Component {

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit(values)
      }
    });
  }

  handleRest = ()=>{
    this.props.form.resetFields();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        span:8
      },
      wrapperCol: {
        span:16
      },
    };
    const formItemLayout_button = {
      style:{
        display: 'flex',
        justifyContent:'flex-end'
      }
    };

    return (
      <div className="SetPassForm" >
          <Form onSubmit={this.handleSubmit} >
              <Form.Item
                {...formItemLayout}
                label="原密码">
                  {
                    getFieldDecorator('OldPassword', {
                    rules: [{
                      required: true,
                      message: '请输入原密码！',
                    }],
                  })(
                    <Input type="text" autoComplete='off' placeholder="请输入原密码" />
                  )}
              </Form.Item>

              <Form.Item
                {...formItemLayout}
                label="新密码">
                  {
                    getFieldDecorator('password', {
                    rules: [{
                      required: true, message: '请输入新密码！',
                    }]
                  })(
                    <Input type="text" autoComplete='off' placeholder="请输入新密码" />
                  )}
              </Form.Item>

              <Form.Item
                {...formItemLayout}
                label="确认密码">
                  {
                    getFieldDecorator('confirm', {
                    rules: [{
                      required: true, message: '请确认您的新密码！',
                    }]
                  })(
                    <Input type="text" autoComplete='off'  placeholder="请确认您的新密码"  />
                  )}
              </Form.Item>

                <Form.Item {...formItemLayout_button}>
                  <Button
                    style={{marginRight:16}}
                    type="primary"
                    htmlType="submit">
                     提交
                  </Button>
                  <Button
                    type="primary"
                    onClick={this.handleRest}>
                     重新输入
                  </Button>
                </Form.Item>
          </Form> 
      </div>);
  }
}

export default Form.create({ name: 'SetPassForm' })(SetPassForm);

