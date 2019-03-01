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
    roles: []
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  componentWillReceiveProps(prevProps) {
    if (prevProps.goSubmit && !this.props.goSubmit) {
      this.handleSubmit()
    }
  }

  handleRest = () => {
    this.props.form.resetFields()
  }

  handleSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      this.props.onSubmited(err, values)
    })
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const { obj = {} } = this.props

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
          {getFieldDecorator('roleId', {
            rules: [{
              required: true, message: '请选择用户角色！',
            }],
            initialValue: obj.roleName&&obj.roleId ?  obj.roleId : undefined
          })(
            <Select
              placeholder="请选择用户角色"
            >
              {
                this.props.roles.map(role => {
                  return (<Option  value={role.id} key={role.id}>{role.roleName}</Option>)
                })
              }
            </Select>
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="用户名"
        >
          {getFieldDecorator('userName', {
            rules: [{
              required: true, message: '请输入用户名！', whitespace: true,
            }, {
              message: '用户名长度必须为6~20位字符', min: 6, max: 20,
            }],
            initialValue: obj.userName
          })(
            <Input placeholder="6~20位字符，字母区分大小写" />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="手机号"
        >
          {getFieldDecorator('linkTel', {
            rules: [{
              required: true, message: '请输入手机号！',
            },
            {
              message: '不是正确的手机号码', pattern: /^1[34578]\d{9}$/,
            }],
            initialValue: obj.linkTel
          })(
            <Input placeholder="请输入手机号" />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label={(
            <span>密码
              <Tooltip title="6-20位，字母与数字结合，字母区分大小写，初始密码默认为123456">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          )}
        >
          {getFieldDecorator('password', {
            rules: [{
              required: true, message: '请输入密码！',
            }, {
              message: '密码长度必须为6~20位字符', min: 6, max: 20,
            }, {
              message: '密码不能全部为数字', pattern: /^.*[^\d].*$/
            }, {
              message: '密码不能全部为字母', pattern: /^.*[^A-z].*$/
            }, {
              message: '密码只能为数字和字母', pattern: /^[A-Za-z0-9]+$/
            }],
          })(
            <Input placeholder="6-20位，字母与数字结合，字母区分大小写" type="password" />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="备注"
        >
          {getFieldDecorator('remarkInfo', {
            rules: [{
              required: false, message: '请输入备注！',
            }],
            initialValue: obj.remarkInfo
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