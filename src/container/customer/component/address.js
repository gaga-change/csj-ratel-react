import React from 'react'
import { Form, Input, Cascader, Button, Checkbox } from 'antd'
import { Area } from '@lib/area'
import { addressTableColumnsConfig } from './config'
import FetchTable from '@component/fetchTable/fetchTable'
import './add.scss'

const { TextArea } = Input

class AddressForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      pagination: {},
      columns: addressTableColumnsConfig,
      dataSource: [{ id: 1 }]
    }
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

  componentDidMount() {
    this.props.onRef(this)
  }

  render() {
    const { getFieldDecorator, isFieldTouched, getFieldError } = this.props.form
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
          <Form.Item label="地址信息" {...formItemLayout}>
            {getFieldDecorator('area', {
              initialValue: '',
              rules: [{ required: true, message: '请选择地址信息' }]
            })(
              <Cascader
                placeholder="请选择地区"
                options={Area}
                onChange={function onChange(value) {
                  console.log(value)
                }}
              />
            )}
          </Form.Item>
          <Form.Item label="详细地址" {...formItemLayout}>
            {getFieldDecorator('exactaddress', {
              initialValue: '',
              rules: [{ required: true, message: '请输入详细地址' }]
            })(<TextArea rows={3} placeholder="请输入详细地址" />)}
          </Form.Item>
          <Form.Item label="邮政编码" {...formItemLayout}>
            {getFieldDecorator('mailcode', {
              initialValue: '',
              rules: [{ required: false }]
            })(<Input autoComplete="off" placeholder="请输入邮政编码" />)}
          </Form.Item>
          <Form.Item label="品牌" {...formItemLayout}>
            {getFieldDecorator('品牌', {
              initialValue: '',
              rules: [{ required: true, message: '请输入品牌' }]
            })(<Input autoComplete="off" placeholder="请输入品牌" />)}
          </Form.Item>

          <Form.Item label="收货人姓名" {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: '',
              rules: [
                { required: true, message: '收货人姓名' },
                { min: 2, max: 25, message: '2-25字符范围内' }
              ]
            })(<Input autoComplete="off" placeholder="请输入收货人姓名" />)}
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
                  message: '请输入正确格式的手机号',
                  pattern: /^1[34578]\d{9}$/
                }
              ]
            })(<Input placeholder="请输入手机" />)}
          </Form.Item>
          <Form.Item
            style={{
              paddingLeft: '25%'
            }}
          >
            {getFieldDecorator('setDefault', {
              valuePropName: 'checked',
              initialValue: true
            })(<Checkbox>设为默认</Checkbox>)}
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              style={{
                marginLeft: '25%'
              }}
              htmlType="submit"
            >
              保存
            </Button>
          </Form.Item>
        </Form>
        <FetchTable
          dataSource={this.state.dataSource}
          columns={this.state.columns}
          loading={this.state.loading}
          pagination={this.state.pagination}
        />
      </div>
    )
  }
}

export default Form.create({ name: 'AddressForm' })(AddressForm)
