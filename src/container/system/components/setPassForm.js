import React from 'react'
import { Form, Input, Button } from 'antd'
import './setPassForm.scss'

class SetPassForm extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      confirmDirty: false
    }
  }

  componentDidMount(){
    this.props.onRef(this)
  }

  handleSubmit = (e) => {
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

  /**
   * 确认密码框失去焦点
   */
  handleConfirmBlur = (e) => {
    const value = e.target.value
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }

  /**
   * 校验规则 。 6 ~ 20 位。字母与数字。
   */
  checkRole = (rule, value, callback) => {
    var regex = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
    if(!regex.test(value)) {
      callback('密码必须为6-20位，字母与数字结合')
    } else {
      callback()
    }
  }

  /**
   * 校验两次密码是否一致
   */
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form
    if (value && value !== form.getFieldValue('newPassword')) {
      callback('输入的两个密码不一致!')
    } else {
      callback()
    }
  }

  /**
   * 更新原密码内容，触发确认密码的校验
   */
  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 20
      },
    }
    const formItemLayout_button = {
      style: {
        display: 'flex',
        justifyContent: 'flex-end'
      }
    }

    return (
      <div className="SetPassForm" >
        <Form onSubmit={this.handleSubmit} >
          <Form.Item
            {...formItemLayout}
            label="原密码">
            {
              getFieldDecorator('oldPassword', {
                rules: [{
                  required: true,
                  message: '请输入原密码！',
                }],
              })(
                <Input type="password" autoComplete='off' placeholder="6-20位，字母与数字结合，字母区分大小写" maxLength={20} />
              )}
          </Form.Item>

          <Form.Item
            {...formItemLayout}
            label="新密码">
            {
              getFieldDecorator('newPassword', {
                rules: [{
                  required: true, message: '请输入新密码！',
                }, {
                  validator: this.validateToNextPassword,
                }, {
                  validator: this.checkRole,
                }]
              })(
                <Input type="password" autoComplete='off' placeholder="6-20位，字母与数字结合，字母区分大小写" />
              )}
          </Form.Item>

          <Form.Item
            {...formItemLayout}
            label="确认密码">
            {
              getFieldDecorator('confirm', {
                rules: [{
                  required: true, message: '请确认您的新密码！',
                }, {
                  validator: this.compareToFirstPassword
                }]
              })(
                <Input type="password" autoComplete='off' placeholder="6-20位，字母与数字结合，字母区分大小写" onBlur={this.handleConfirmBlur} />
              )}
          </Form.Item>

          <Form.Item {...formItemLayout_button}>
            <Button
              style={{ marginRight: 16 }}
              type="primary"
              htmlType="submit"
              loading={this.props.loading}>
              提交
                  </Button>
            <Button
              type="primary"
              onClick={this.handleRest}>
              重新输入
                  </Button>
          </Form.Item>
        </Form>
      </div>)
  }
}

export default Form.create({ name: 'SetPassForm' })(SetPassForm)

