import React from 'react'
import { Form, Input } from 'antd'
import './add.scss'

const { TextArea } = Input
class AddForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let params = { ...values }
        if (this.props.customData) {
          params.id = this.props.customData.id
          this.props.onSubmit('modify', params)
        } else {
          this.props.onSubmit('add', params)
        }
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
    const { getFieldDecorator } = this.props.form
    let { customData = {} } = this.props
    customData = customData || {}
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
            {
              getFieldDecorator('customerName', {
                initialValue: customData.customerName,
                rules: [{ required: true, message: '请输入客户名称' }]
              })(<Input autoComplete="off" placeholder="请输入客户名称" />)
            }
          </Form.Item>

          <Form.Item label="负责人" {...formItemLayout}>
            {
              getFieldDecorator('customerLinkUser', {
                initialValue: customData.customerLinkUser,
                rules: [{ required: true, message: '请输入负责人' }]
              })(<Input autoComplete="off" placeholder="请输入负责人" />)
            }
          </Form.Item>

          <Form.Item label="手机"{...formItemLayout}>
            {
              getFieldDecorator('customerLinkuserTel', {
                initialValue: customData.customerLinkuserTel,
                rules: [{ required: false, message: '请输入正确格式的手机号', pattern: /^1[3456789]\d{9}$/ }],
              })(<Input placeholder="请输入手机" />)
            }
          </Form.Item>
          <Form.Item label="备注"{...formItemLayout}>
            {
              getFieldDecorator('remarkInfo', {
                initialValue: customData.remarkInfo,
                rules: [{ required: false }, { max: 50, message: '备注请控制在50个汉字范围内' }],
              })(<TextArea rows={3} placeholder="请输入备注" />)
            }
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default Form.create({ name: 'AddForm' })(AddForm)
