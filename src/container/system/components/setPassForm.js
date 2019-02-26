import React from 'react';
import {Form, Input,Row,Col,Button} from 'antd';

/**
 * props:
 *  goSubmit<Boolean> 是否进行表单提交操作。如果 false->true 则会提交表单
 *  onSubmited<Function> 表单提交结束。通知父组件将goSubmit修改为 false
 *      @returns err,values
 */
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
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <div className="CommodityForm">
          <Form onSubmit={this.handleSubmit} >
            <Row gutter={24}>
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
                    <Input type="password" />
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
                    <Input type="password" />
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
                    <Input type="password" onBlur={this.handleConfirmBlur} />
                  )}
              </Form.Item>

              <Col span={24}>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit">
                     确定
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form> 
      </div>);
  }
}

export default Form.create({ name: 'SetPassForm' })(SetPassForm);

