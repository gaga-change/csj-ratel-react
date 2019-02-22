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
        span: 6
      },
      wrapperCol: {
        span: 10
      }
    }
    return (
      <div className="AddForm">
        <Form onSubmit={this.handleSubmit}>
          <Form.Item label="客户名称" {...formItemLayout}>
            {getFieldDecorator('customer', {
              initialValue: '',
              rules: [{ required: true, message: '请输入客户名称' }]
            })(<Input autoComplete="off" placeholder="请输入商品名称" />)}
          </Form.Item>

          <Form.Item label="负责人" {...formItemLayout}>
            {getFieldDecorator('leader', {
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
            {getFieldDecorator('phone', {
              rules: [
                {
                  validator: (rule, value, callback) => {
                    if (value && !/^1[34578]\d{9}$/.test(value)) {
                      callback('手机号输入有误')
                    }
                    callback()
                  }
                }
              ]
            })(<Input placeholder="请输入手机" />)}{' '}
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default Form.create({ name: 'AddForm' })(AddForm)
