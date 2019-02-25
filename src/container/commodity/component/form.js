import React from 'react';
import { Form, Input,Button,Row,Col,InputNumber } from 'antd';
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
    const { selectWordsArr=[],submitTex="查询",resetText="重置"} = this.props;

    return (
      <div className="CommodityForm">
          <Form onSubmit={this.handleSubmit}  layout="inline">
            <Row gutter={24}>
               { 
                selectWordsArr.includes('商品名称')&&
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
               }
               {
                 selectWordsArr.includes('商品编码')&&
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
 
               }
               {
                  selectWordsArr.includes('成本价')&&
                  <Col span={6} style={{width:'300px',marginBottom:'12px'}}>
                    <Form.Item label="成本价">
                      { getFieldDecorator('成本价', {
                        initialValue:'',
                        rules: [{ required: false, message: '' }],
                      })(
                        <InputNumber  style={{width:200}}  placeholder="请输入成本价" />
                      )}
                    </Form.Item>
                  </Col>
               }
               {
                  selectWordsArr.includes('售价')&&
                  <Col span={6} style={{width:'300px',marginBottom:'12px'}}>
                    <Form.Item label="售价">
                      { getFieldDecorator('售价', {
                        initialValue:'',
                        rules: [{ required: false, message: '' }],
                      })(
                        <InputNumber  style={{width:200}}  placeholder="请输入售价" />
                      )}
                    </Form.Item>
                  </Col>
               }

                <Col span={24}>
                  <Form.Item>
                    <Button
                      type="primary"
                      style={{marginRight:'12px'}}
                      htmlType="submit">
                      {submitTex}
                    </Button>
                    <Button
                      type="primary"
                      onClick={this.handleRest}
                      htmlType="submit">
                      {resetText}
                    </Button>
                  </Form.Item>
                </Col>
             
            </Row>
          </Form> 
      </div>);
  }
}

export default Form.create({ name: 'CommodityForm' })(CommodityForm);
