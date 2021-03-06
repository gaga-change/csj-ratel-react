import React from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Button, Row, Col } from 'antd';
import './search.scss'
class CommodityForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        for(let i in values){
          if(Array.isArray(values[i])&&!values[i].length){
             delete values[i]
          } else if([undefined,'undefined',''].includes(values[i])){
             delete values[i]
          }
        }
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
                <Col span={6} style={{width:'292px',marginBottom:'12px'}}>
                  <Form.Item label="客户名称">
                    { getFieldDecorator('customerName', {
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
                 <Col span={6} style={{width:'292px',marginBottom:'12px'}}>
                  <Form.Item label="负责人">
                    { getFieldDecorator('customerLinkUser', {
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
                    { getFieldDecorator('customerLinkuserTel', {
                      rules: [{ required: false}],
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
