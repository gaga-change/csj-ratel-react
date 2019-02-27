import React from 'react'
import { Form, Input } from 'antd'
import './add.scss'

class AddForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit(values)
      }
    })
  }

  handleRest = () => {
    this.props.form.resetFields()
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  render() {
    const { getFieldDecorator, getFieldError, isFieldTouched } = this.props.form
    const phoneError = isFieldTouched('phone') && getFieldError('phone')
    const formItemLayout = {
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 12
      }
    }
    return (
      <div className="AddForm">
        <Form onSubmit={this.handleSubmit}>
          <Form.Item label="客户名称" {...formItemLayout}>
            {getFieldDecorator('customerName', {
              initialValue: '',
              rules: [{ required: true, message: '请输入客户名称' }]
            })(<Input autoComplete="off" placeholder="请输入商品名称" />)}
          </Form.Item>

          <Form.Item label="负责人" {...formItemLayout}>
            {getFieldDecorator('customerLinkUser', {
              initialValue: '',
              rules: [{ required: true, message: '请输入负责人' }]
            })(<Input autoComplete="off" placeholder="请输入负责人" />)}
          </Form.Item>

          <Form.Item
            label="手机"
            {...formItemLayout}
            validateStatus={phoneError ? 'error' : ''}
            help={phoneError || ''}
          >
            {getFieldDecorator('customerLinkuserTel', {
              rules: [{ required: false, message:'请输入正确格式的手机号',pattern:/^1[34578]\d{9}$/ }],
            })(<Input placeholder="请输入手机" />)}{' '}
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default Form.create({ name: 'AddForm' })(AddForm)
