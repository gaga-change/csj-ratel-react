import React from 'react'
import './search.scss'
import { Form, Input, Button } from 'antd'

class SearchForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    console.log(this.props)
  }
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
  render() {
    const { getFieldDecorator, getFieldError, isFieldTouched } = this.props.form
    // Only show error after a field is touched.
    const customerError =
      isFieldTouched('customer') && getFieldError('customer')
    const leaderError = isFieldTouched('leader') && getFieldError('leader')
    const phoneError = isFieldTouched('phone') && getFieldError('phone')

    return (
      <div className="CommodityForm">
        <Form onSubmit={this.handleSubmit} layout="inline">
          <Form.Item
            label="客户名称"
            validateStatus={customerError ? 'error' : ''}
            help={customerError || ''}
          >
            {getFieldDecorator('customer', {
              rules: [
                {
                  min: 1,
                  max: 10,
                  message: '客户名称长度不在范围内'
                }
              ]
            })(<Input placeholder="请输入客户名称" />)}{' '}
          </Form.Item>{' '}
          <Form.Item
            label="负责人"
            validateStatus={leaderError ? 'error' : ''}
            help={leaderError || ''}
          >
            {getFieldDecorator('leader', {
              rules: [
                {
                  min: 1,
                  max: 10,
                  message: '负责人输入的长度不在范围内'
                }
              ]
            })(<Input placeholder="请输入负责人" />)}{' '}
          </Form.Item>{' '}
          <Form.Item
            label="手机"
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
          <Button
            type="primary"
            style={{
              marginRight: '12px'
            }}
            htmlType="submit"
          >
            查询
          </Button>
          <Button onClick={this.handleRest} htmlType="submit">
            重置
          </Button>
        </Form>
      </div>
    )
  }
}

export default Form.create({
  name: 'SearchForm'
})(SearchForm)
