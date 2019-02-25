import React from 'react';
import { Form, Input,InputNumber } from 'antd';
import './addform.scss'

const { TextArea } = Input;

class AddForm extends React.Component {

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit(values)
      }
    });
  }

  handleRest = ()=>{
    this.props.form.resetFields();
  }

  componentDidMount(){
    this.props.onRef(this)
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        span:6
      },
      wrapperCol: {
        span:10
      },
    };

    const formItemLayout_left = {
      labelCol: {
        span:7
      },
      wrapperCol: {
        span:17
      },
      style:{
        width:300,
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

    return (
       <div className="AddForm">
          <Form 
            layout="inline"
            onSubmit={this.handleSubmit} >
                <Form.Item label="商品名称" {...formItemLayout_left}>
                  { getFieldDecorator('商品名称', {
                    initialValue:'',
                    rules: [{ required: true, message: '请输入商品名称' }],
                  })(
                    <Input  autoComplete='off' placeholder="请输入商品名称" />
                  )}
                </Form.Item>

                <Form.Item label="商品编码" {...formItemLayout_right}>
                  { getFieldDecorator('商品编码', {
                    initialValue:'',
                    rules: [{ required: true, message: '请输入商品编码' }],
                  })(
                    <Input  autoComplete='off' placeholder="请输入商品编码" />
                  )}
                </Form.Item>

                 <Form.Item label="品牌" {...formItemLayout_left}>
                  { getFieldDecorator('品牌', {
                    initialValue:'',
                    rules: [{ required: true, message: '请输入品牌' }],
                  })(
                    <Input  autoComplete='off' placeholder="请输入品牌" />
                  )}
                </Form.Item>

                <Form.Item label="单位" {...formItemLayout_right}>
                  { getFieldDecorator('单位', {
                    initialValue:'',
                    rules: [{ required: true, message: '请输入单位' }],
                  })(
                    <Input  autoComplete='off' placeholder="请输入单位" />
                  )}
                </Form.Item>

                <Form.Item label="规格型号" {...formItemLayout_left}>
                  { getFieldDecorator('规格型号', {
                    initialValue:'',
                    rules: [{ required: false }],
                  })(
                    <Input  autoComplete='off' placeholder="请输入规格型号" />
                  )}
                </Form.Item>

                <Form.Item label="成本价" {...formItemLayout_right}>
                  { getFieldDecorator('成本价', {
                    initialValue:'',
                    rules: [{ required: true,type:'number',message:'请输入正数阿拉伯数字' }],
                  })(
                    <InputNumber  style={{minWidth:'200px'}}  placeholder="请输入成本价" />
                  )}
                </Form.Item>

                 <Form.Item label="售价" {...formItemLayout_left}>
                  { getFieldDecorator('售价', {
                    initialValue:'',
                    rules: [{ required: true, type:'number', message:'请输入正数阿拉伯数字' }],
                  })(
                    <InputNumber  style={{minWidth:'200px'}}  placeholder="请输入售价" />
                  )}
                </Form.Item>

                <Form.Item label="商品描述" {...formItemLayout_right}>
                  { getFieldDecorator('商品描述', {
                    initialValue:'',
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
