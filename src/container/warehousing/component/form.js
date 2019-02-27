import React from 'react';
import { Form, Input,Button,Row,Col,Select,DatePicker } from 'antd';
import './form.scss'

const { RangePicker } = DatePicker;
const Option = Select.Option;

class SelestForm extends React.Component {
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
    const { selectWordsArr=[],className='CommodityForm' } = this.props;

    return (
      <div className={className}>
          <Form onSubmit={this.handleSubmit}  layout="inline">
            <Row gutter={24}>
            
            {
               selectWordsArr.includes('业务单号')&&
               <Col span={6} style={{width:'290px',marginBottom:'12px'}}>
                  <Form.Item label="业务单号">
                    { getFieldDecorator('planCode', {
                      initialValue:'',
                      rules: [{ required: false, message: '' }],
                    })(
                      <Input autoComplete='off' placeholder="请输入业务单号" />
                    )}
                  </Form.Item>
                </Col>
              }

              {
               selectWordsArr.includes('商品名称')&&
               <Col span={6} style={{width:'290px',marginBottom:'12px'}}>
                  <Form.Item label="商品名称">
                    { getFieldDecorator('skuName', {
                      initialValue:'',
                      rules: [{ required: false, message: '' }],
                    })(
                      <Input autoComplete='off' placeholder="请输入商品名称" />
                    )}
                  </Form.Item>
                </Col>
              }

              {
                 selectWordsArr.includes('状态')&&
                 <Col span={6} style={{width:'290px',marginBottom:'12px'}}>
                  <Form.Item label="状态">
                    { getFieldDecorator('planState', {
                      rules: [{ required: false, message: '' }],
                    })(
                      <Select  style={{width:180}} placeholder="请选择状态">
                        <Option value="5">Jack</Option>
                        <Option value="0">Lucy</Option>
                      </Select>
                    )}
                  </Form.Item>
                 </Col>
              }

              {
                selectWordsArr.includes('创建日期')&&
                <Col span={8} style={{marginBottom:'12px'}}>
                  <Form.Item label="创建日期">
                    { getFieldDecorator('createTime', {
                      rules: [{ type: 'array', required: false }],
                    })(
                      <RangePicker />
                    )}
                  </Form.Item>
              </Col>
              }

              {
                 selectWordsArr.includes('查询')&&
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
              }

              {
                selectWordsArr.includes('查询重置')&&
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
              }
            </Row>
          </Form> 
      </div>);
  }
}

export default Form.create({ name: 'SelestForm' })(SelestForm);
