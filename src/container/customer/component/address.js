import React from 'react'
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Cascader, Button, Checkbox, message } from 'antd';
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

  handleReadAddress = () => {
    let address = this.props.form.getFieldValue("customerAddress") || ""
    let res = []
    for (let i = 0; i < Area.length; i++) {
      let province = Area[i]
      if (~address.indexOf(province.value)) {
        res.push(province)
        for (let j = 0; j < province.children.length; j++) {
          let city = province.children[j]
          if (~address.indexOf(city.value)) {
            res.push(city)
            for (let j = 0; j < city.children.length; j++) {
              let area = city.children[j]
              if (~address.indexOf(area.value)) {
                res.push(area)
              }
            }
          }
        }
        break
      }
    }
    if (res.length === 0) {
      message.warning("请核查输入地址是否准确，如有错误，请及时修改");
    } else {
      this.props.form.setFieldsValue({ area: res.map(v => v.value) })
    }
  }

  handleClearAddress = () => {
    this.props.form.setFieldsValue({ customerAddress: "" })
  }

  handleRest = () => {
    this.props.form.resetFields()
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { customerProvince, customerCity, customerArea, customerAddress, postalCode, receiverName, receiverTel, remarkInfo, isDefault } = this.props.addressDetail;
    const formItemLayout_left = {
      labelCol: {
        span: 9
      },
      wrapperCol: {
        span: 15
      },
      style: {
        width: 400,
        'minHeight': 60
      }
    };

    const formItemLayout_right = {
      labelCol: {
        span: 8
      },
      wrapperCol: {
        span: 16
      },
      style: {
        width: 400,
      }
    };

    const formItemLayout_Checkbox = {
      style: {
        paddingLeft: 150
      }
    };

    const formItemLayout_button = {
      style: {
        display: 'flex',
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
                initialValue: [customerProvince, customerCity, customerArea].filter(v => v),
                rules: [{ required: true, message: '请选择地址信息' }]
              })(<Cascader placeholder="请选择地区" options={Area} />)
            }
          </Form.Item>

          <Form.Item label="详细地址" {...formItemLayout_right} style={{ width: 400, minHeight: 110 }}>
            {
              getFieldDecorator('customerAddress', {
                initialValue: customerAddress,
                rules: [{ required: true, message: '请输入详细地址' }]
              })(<TextArea rows={3} placeholder="请输入详细地址" maxLength={45} />)
            }
          </Form.Item>
          <span style={{ display: "inline-block", height: '73px', paddingTop: '53px' }}>
            <span className="btn-link ml10" onClick={this.handleReadAddress}>识别</span>
            <span className="btn-link ml10" onClick={this.handleClearAddress}>清空</span>
          </span>

          <Form.Item label="邮政编码" {...formItemLayout_left}>
            {getFieldDecorator('postalCode', {
              initialValue: postalCode,
              rules: [{ required: false }]
            })(<Input autoComplete="off" placeholder="请输入邮政编码" />)}
          </Form.Item>

          <Form.Item label="收货人姓名" {...formItemLayout_right}>
            {
              getFieldDecorator('receiverName', {
                initialValue: receiverName,
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
                initialValue: receiverTel,
                rules: [
                  {
                    required: true,
                    message: '手机号必填且格式要正确',
                    pattern: /^1[3456789]\d{9}$/
                  }
                ]
              })(<Input placeholder="请输入手机" />)}
          </Form.Item>

          <Form.Item {...formItemLayout_Checkbox}>
            {
              getFieldDecorator('isDefault', {
                valuePropName: 'checked',
                initialValue: isDefault !== undefined ? Boolean(isDefault) : true
              })(<Checkbox>设为默认</Checkbox>)
            }
          </Form.Item>
          <Form.Item label="备注"{...formItemLayout_left}>
            {
              getFieldDecorator('remarkInfo', {
                initialValue: remarkInfo,
                rules: [{ required: false }, { max: 80, message: '备注请控制在80个汉字范围内' }],
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
    );
  }
}

export default Form.create({ name: 'AddressForm' })(AddressForm)
