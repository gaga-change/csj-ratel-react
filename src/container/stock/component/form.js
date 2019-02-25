import React from 'react';
import { Form, Input,Button,Row,Col  } from 'antd';
import './form.scss'
class CommodityForm extends React.Component {
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

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div className="CommodityForm">
          <Form onSubmit={this.handleSubmit}  layout="inline">
            <Row gutter={24}>

              <Col span={6} style={{width:'290px',marginBottom:'12px'}}>
                <Form.Item label="仓库名称">
                  { getFieldDecorator('仓库名称', {
                    initialValue:'',
                    rules: [{ required: false, message: '' }],
                  })(
                    <Input   autoComplete='off' placeholder="请输入仓库名称" />
                  )}
                </Form.Item>
              </Col>

              <Col span={6} style={{width:'290px',marginBottom:'12px'}}>
                <Form.Item label="商品名称">
                  { getFieldDecorator('username', {
                    initialValue:'',
                    rules: [{ required: false, message: '' }],
                  })(
                    <Input   autoComplete='off' placeholder="请输入商品名称" />
                  )}
                </Form.Item>
              </Col>

              <Col span={6} style={{width:'290px',marginBottom:'12px'}}>
                <Form.Item label="商品编码">
                  { getFieldDecorator('password', {
                    initialValue:'',
                    rules: [{ required: false, message: '' }],
                  })(
                    <Input  autoComplete='off' placeholder="请输入商品编码" />
                  )}
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item>
                  <Button
                    type="primary"
                    style={{marginRight:'12px'}}
                    htmlType="submit">
                    查询
                  </Button>
                  <Button
                    type="primary"
                    onClick={this.handleRest}
                    htmlType="submit">
                    重置
                  </Button>
                </Form.Item>
              </Col>

            </Row>
          </Form> 
      </div>);
  }
}

export default Form.create({ name: 'CommodityForm' })(CommodityForm);
