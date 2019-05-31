import React from 'react'
import { Form, Input } from 'antd'
import './add.scss'

class AddForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let params = { ...values }
        if (this.props.provider) {
          params.id = this.props.provider.id
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
    let { provider = {} } = this.props
    provider = provider || {}
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
          <Form.Item label="供应商名称" {...formItemLayout}>
            {
              getFieldDecorator('providerName', {
                initialValue: provider.providerName,
                rules: [{ required: true, message: '请输入供应商名称' }]
              })(<Input autoComplete="off" placeholder="请输入供应商名称" />)
            }
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default Form.create({ name: 'AddForm' })(AddForm)
