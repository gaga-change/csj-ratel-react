import React from 'react'
import { Form, Input, Cascader, Button, Checkbox } from 'antd'
import { Area } from '@lib/area'
import './add.scss'

const { TextArea } = Input
class AddressForm extends React.Component {
  
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
    const { getFieldDecorator} = this.props.form
    const {customerProvince,customerCity, customerArea,customerAddress,postalCode,receiverName,receiverTel,isDefault} = this.props.addressDetail;
    const formItemLayout_left = {
      labelCol: {
        span:9
      },
      wrapperCol: {
        span:15
      },
      style:{
        width:400,
        height:60
      }
    };

    const formItemLayout_right = {
      labelCol: {
        span:8
      },
      wrapperCol: {
        span:16
      },
      style:{
        width:400,
      }
    };

    const formItemLayout_Checkbox = {
      style:{
        paddingLeft:150
      }
    };

    const formItemLayout_button = {
      style:{
        display:'flex',
        justifyContent: 'flex-end',
      }
    };

    return (
      <div className="AddressForm">

        <Form
          layout="inline"
          onSubmit={this.handleSubmit}>
          <Form.Item label="地址信息" {...formItemLayout_left}>
            {
              getFieldDecorator('area', {
                initialValue: [customerProvince,customerCity, customerArea].filter(v=>v),
                rules: [{ required: true, message: '请选择地址信息' }]
              })(<Cascader placeholder="请选择地区" options={Area}/>)
            }
          </Form.Item>

          <Form.Item label="详细地址" {...formItemLayout_right} style={{width:400,minHeight:110}}>
            {
              getFieldDecorator('customerAddress', {
                initialValue: customerAddress,
                rules: [{ required: true, message: '请输入详细地址' }]
              })(<TextArea rows={3} placeholder="请输入详细地址" />)
            }
          </Form.Item>

          <Form.Item label="邮政编码" {...formItemLayout_left}>
            {getFieldDecorator('postalCode', {
              initialValue:postalCode,
              rules: [{ required: false }]
            })(<Input autoComplete="off" placeholder="请输入邮政编码" />)}
          </Form.Item>

          <Form.Item label="收货人姓名" {...formItemLayout_right}>
            {
              getFieldDecorator('receiverName', {
                initialValue:receiverName,
                rules: [
                  { required: true, message: '收货人姓名' },
                  { min: 2, max: 25, message: '2-25字符范围内' }
                ]
              })(<Input autoComplete="off" placeholder="请输入收货人姓名" />)
            }
          </Form.Item>

          <Form.Item
            label="手机"
            {...formItemLayout_left}>
              {
                getFieldDecorator('receiverTel', {
                  initialValue:receiverTel,
                  rules: [
                    {
                      required: true,
                      message: '手机号必填且格式要正确',
                      pattern: /^1[34578]\d{9}$/
                    }
                  ]
               })(<Input placeholder="请输入手机" />)}
          </Form.Item>

          <Form.Item {...formItemLayout_Checkbox}>
              {
                getFieldDecorator('isDefault', {
                  valuePropName: 'checked',
                  initialValue: isDefault!==undefined?Boolean(isDefault):true
                })(<Checkbox>设为默认</Checkbox>)
              }
          </Form.Item>
          <Form.Item label="备注"{...formItemLayout_left}>
              { 
                getFieldDecorator('remarkInfo', {
                })(<TextArea rows={3} placeholder="请输入备注" />)
              }
          </Form.Item>
          <Form.Item {...formItemLayout_button}>
            <Button
              type="primary"
              htmlType="submit">
                保存
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default Form.create({ name: 'AddressForm' })(AddressForm)
