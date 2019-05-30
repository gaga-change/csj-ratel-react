import React from 'react';
import { Form, Input, Cascader } from 'antd';
import { depthForEachCascader } from '@lib/lib'
import request from '@lib/request'
import './addform.scss'

const { TextArea } = Input;

class AddForm extends React.Component {

  state = {
    categoryTrees: [],
    activeCascader: {}
  }

  handleSubmit = (e) => {
    let { activeCascader } = this.state;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit({ ...values, ...activeCascader })
      }
    });
  }

  handleRest = () => {
    this.props.form.resetFields();
    this.setState({ activeCascader: {} })
  }

  componentDidMount() {
    this.props.onRef(this)
    this.fetch()
  }

  fetch = () => {
    request({
      url: '/api/sku/category/trees',
      method: 'get',
    }).then(res => {
      this.setState({
        categoryTrees: (res && res.children) || []
      })
    }).catch(err => {
    })
  }

  onChange = (value, selectedOptions) => {
    let { activeCascader } = this.state;
    activeCascader = selectedOptions[selectedOptions.length - 1];
    this.setState({
      activeCascader: {
        categoryCode: activeCascader.value,
        categoryName: activeCascader.label
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    let { categoryTrees } = this.state;
    categoryTrees = depthForEachCascader(categoryTrees)
    const formItemLayout_left = {
      labelCol: {
        span: 7
      },
      wrapperCol: {
        span: 17
      },
      style: {
        width: 300,
        height: 60
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

    return (
      <div className="AddForm">
        <Form
          layout="inline"
          onSubmit={this.handleSubmit} >
          <Form.Item label="商品名称" {...formItemLayout_left}>
            {getFieldDecorator('skuName', {
              initialValue: '',
              rules: [{ required: true, message: '请输入商品名称' }],
            })(
              <Input autoComplete='off' placeholder="请输入商品名称" />
            )}
          </Form.Item>

          <Form.Item label="商品分类" {...formItemLayout_right}>
            {getFieldDecorator('categoryCode', {
              initialValue: [],
              rules: [{ required: true, message: '请选择商品分类' }],
            })(
              <Cascader options={categoryTrees} onChange={this.onChange} placeholder="请选择商品分类" />
            )}
          </Form.Item>
          <Form.Item label="货主商品编码" {...formItemLayout_left}>
            {getFieldDecorator('skuCode', {
            })(
              <Input autoComplete='off' placeholder="请输入货主商品编码" />
            )}
          </Form.Item>
          <Form.Item label="品牌" {...formItemLayout_right}>
            {getFieldDecorator('brandName', {
              initialValue: '',
              rules: [{ required: true, message: '请输入品牌' }],
            })(
              <Input autoComplete='off' placeholder="请输入品牌" />
            )}
          </Form.Item>

          <Form.Item label="单位" {...formItemLayout_left}>
            {getFieldDecorator('skuUnitName', {
              initialValue: '',
              rules: [{ required: true, message: '请输入单位' }],
            })(
              <Input autoComplete='off' placeholder="请输入单位" />
            )}
          </Form.Item>
          <Form.Item label="规格" {...formItemLayout_right}>
            {getFieldDecorator('skuFormat', {
              initialValue: '',
              rules: [{ required: true, message: '请输入规格' }],
            })(
              <Input autoComplete='off' placeholder="请输入规格" />
            )}
          </Form.Item>
          <Form.Item label="型号" {...formItemLayout_left}>
            {getFieldDecorator('skuModel', {
              initialValue: '',
              rules: [{ required: true, message: '请输入型号' }],
            })(
              <Input autoComplete='off' placeholder="请输入型号" />
            )}
          </Form.Item>
          <Form.Item label="商品描述" {...formItemLayout_right}>
            {getFieldDecorator('remarkInfo', {
              initialValue: '',
              rules: [{ required: false }],
            })(
              <TextArea rows={4} placeholder="请输入商品描述" />
            )}
          </Form.Item>
        </Form>
      </div>);
  }
}

export default Form.create({ name: 'AddForm' })(AddForm);
