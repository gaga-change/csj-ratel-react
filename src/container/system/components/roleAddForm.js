import React from 'react'
import {Form, Input} from 'antd'
const { TextArea } = Input
/**
 * props:
 *  goSubmit<Boolean> 是否进行表单提交操作。如果 false->true 则会提交表单
 *  onSubmited<Function> 表单提交结束。通知父组件将goSubmit修改为 false
 *      @returns err,values
 */
class DataForm extends React.Component {
  state = {
  }

  componentWillReceiveProps (prevProps) {
    if (prevProps.goSubmit && !this.props.goSubmit) {
      this.handleSubmit()
    }
  }

  componentDidMount(){
    this.props.onRef(this)
  }

  handleSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      this.props.onSubmited(err, values)
    })
  }

  handleRest = () => {
    this.props.form.resetFields()
  }

  render () {
    const { getFieldDecorator } = this.props.form

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item
          {...formItemLayout}
          label="角色名称"
        >
          {getFieldDecorator('roleName', {
            rules: [{
              required: true, message: '请输入角色名称！',
            }],
          })(
            <Input maxLength={50}/>
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="角色描述"
        >
          {getFieldDecorator('roleDesc', {
            rules: [{
              required: false, message: '请输入角色描述！',
            }],
          })(
            <TextArea rows={4} maxLength={300}/>
          )}
        </Form.Item>
      </Form>
    )
  }
}

const RoleAddForm = Form.create({ name: 'role_add_form' })(DataForm)
export default RoleAddForm