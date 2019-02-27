import React from 'react';
import { Form, Input,Button,Row,Col,InputNumber } from 'antd';
import './form.scss'
class CommodityForm extends React.Component {
  state={

  }

  handleSubmit = (e) => {
    let {modifypriceActiveRow}=this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let json=values;
        if(modifypriceActiveRow){
          json.skuId=modifypriceActiveRow.id
        }
        this.props.onSubmit(json)
      }
    });
  }

  handleRest = ()=>{
    this.props.form.resetFields();
  }

  componentDidMount(){
    if(this.props.onRef){
      this.props.onRef(this)
    }
  }

  render() {
    const { getFieldDecorator} = this.props.form;
    const { selectWordsArr=[],submitTex="查询",resetText="重置",modifypriceActiveRow,loading=false} = this.props;

    return (
      <div className="CommodityForm">
          <Form onSubmit={this.handleSubmit}  layout="inline">
            <Row gutter={24}>
               { 
                selectWordsArr.includes('商品名称')&&
                <Col span={6} style={{width:'290px',marginBottom:'12px'}}>
                  <Form.Item label="商品名称">
                    { getFieldDecorator('skuName', {
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
                    { getFieldDecorator('skuCode', {
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
                      { getFieldDecorator('costPrice', {
                        initialValue:modifypriceActiveRow.costPrice,
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
                      { getFieldDecorator('salePrice', {
                        initialValue:modifypriceActiveRow.salePrice,
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
                      loading={loading}
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
