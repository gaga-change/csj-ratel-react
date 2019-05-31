import React from 'react'


import {
  Form,
  Input,
  Tooltip,
  Icon,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete,
} from 'antd'

const { Option } = Select
const AutoCompleteOption = AutoComplete.Option


class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
      }
    })
  }

  handleConfirmBlur = e => {
    const value = e.target.value
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }

  render() {
    const { getFieldDecorator } = this.props.form

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item
          label="供应商"
        >
          {getFieldDecorator('nickname', {
            rules: [{ required: true, message: '请选择供应商!', whitespace: true }],
          })(<Input placeholder="请选择供应商" />)}
        </Form.Item>
        <Form.Item
          label="进货价"
        >
          {getFieldDecorator('purchasePrice', {
            rules: [{ required: true, message: '请输入供货价!', whitespace: true }],
          })(<Input placeholder="请输入供货价" />)}
        </Form.Item>
        <Form.Item
          label="单位"
        >
          {getFieldDecorator('largePackUnitName', {
            rules: [{ required: true, message: '请输入大包装单位!', whitespace: true }],
          })(<Input placeholder='请输入大包装单位' maxLength={20} />)}
        </Form.Item>
      </Form>
    )
  }
}

const WrappedRegistrationForm = Form.create({ name: 'register' })(RegistrationForm)

class SupplyPrice extends React.Component {
  state = {

  }

  componentDidMount() {
  }

  componentWillUnmount() {

  }

  componentWillUpdate(props) {
  }

  render() {
    return (
      <div>
        <WrappedRegistrationForm />
      </div>
    )
  }
}

export default SupplyPrice