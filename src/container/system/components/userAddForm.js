import React from 'react';
import { Form, Input, Select, Tooltip, Icon } from 'antd';
const { Option } = Select;
const { TextArea } = Input;
/**
 * props:
 *  goSubmit<Boolean> 是否进行表单提交操作。如果 false->true 则会提交表单
 *  onSubmited<Function> 表单提交结束。通知父组件将goSubmit修改为 false
 *      @returns err,values
 */
class DataForm extends React.Component {
  state = {
  }

  componentWillReceiveProps(prevProps) {
    if (prevProps.goSubmit && !this.props.goSubmit) {
      this.handleSubmit()
    }
  }

  handleSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      this.props.onSubmited(err, values)
    })
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
      <Form onSubmit={this.handleSubmit}>
        <Form.Item
          {...formItemLayout}
          label="用户角色"
        >
          {getFieldDecorator('role', {
            rules: [{
              required: true, message: '请选择用户角色！',
            }],
          })(
            <Select
              placeholder="请选择用户角色"
            >
              <Option value="销售">销售</Option>
              <Option value="采购">采购</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="用户名"
        >
          {getFieldDecorator('username', {
            rules: [{
              required: true, message: '请输入用户名！',
            }],
          })(
            <Input placeholder="6~12位字符，字母区分大小写" />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="手机号"
        >
          {getFieldDecorator('phone', {
            rules: [{
              required: true, message: '请输入手机号！',
            }],
          })(
            <Input placeholder="请输入手机号" />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label={(
            <span>
              密码&nbsp;
              <Tooltip title="6-20位，字母与数字结合，字母区分大小写，初始密码默认为123456">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          )}
        >
          {getFieldDecorator('password', {
            rules: [{
              required: true, message: '请输入密码！',
            }],
          })(
            <Input placeholder="6-20位，字母与数字结合，字母区分大小写" type="password"/>
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="备注"
        >
          {getFieldDecorator('remark', {
            rules: [{
              required: false, message: '请输入备注！',
            }],
          })(
            <TextArea rows={4} placeholder="请输入备注" />
          )}
        </Form.Item>
      </Form>
    )
  }
}

const UserAddForm = Form.create({ name: 'user_add_form' })(DataForm);
export default UserAddForm