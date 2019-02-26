import React from 'react';
import { Form, Input,Button,Row,Col } from 'antd';
import './search.scss'
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
                selectWordsArr.includes('客户名称')&&
                <Col span={6} style={{width:'290px',marginBottom:'12px'}}>
                  <Form.Item label="客户名称">
                    { getFieldDecorator('username', {
                      initialValue:'',
                      rules: [{ required: false, message: '' }],
                    })(
                      <Input   autoComplete='off' placeholder="请输入客户名称" />
                    )}
                  </Form.Item>
                </Col>
               }
               {
                 selectWordsArr.includes('负责人')&&
                 <Col span={6} style={{width:'290px',marginBottom:'12px'}}>
                  <Form.Item label="负责人">
                    { getFieldDecorator('password', {
                      initialValue:'',
                      rules: [{ required: false, message: '' }],
                    })(
                      <Input  autoComplete='off' placeholder="请输入负责人" />
                    )}
                  </Form.Item>
               </Col>
              }

             {
               selectWordsArr.includes('手机')&&
               <Col span={6} style={{width:'300px',marginBottom:'12px'}}>
                  <Form.Item label="手机">
                    { getFieldDecorator('手机', {
                      rules: [{ required: false, message:'请输入正确格式的手机号',pattern:/^1[34578]\d{9}$/ }],
                    })(
                      <Input autoComplete='off' placeholder="请输入手机号" />
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
