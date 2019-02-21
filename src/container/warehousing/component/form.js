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

    return (
      <div className="CommodityForm">
          <Form onSubmit={this.handleSubmit}  layout="inline">
            <Row gutter={24}>
              <Col span={6} style={{width:'290px',marginBottom:'12px'}}>
                <Form.Item label="商品名称">
                  { getFieldDecorator('username', {
                    initialValue:'',
                    rules: [{ required: false, message: '' }],
                  })(
                    <Input autoComplete='off' placeholder="请输入商品名称" />
                  )}
                </Form.Item>
              </Col>

              <Col span={6} style={{width:'290px',marginBottom:'12px'}}>
                <Form.Item label="状态">
                  { getFieldDecorator('password', {
                    rules: [{ required: false, message: '' }],
                  })(
                    <Select  style={{width:180}} placeholder="请选择状态">
                      <Option value="jack">Jack</Option>
                      <Option value="lucy">Lucy</Option>
                      <Option value="disabled" disabled>Disabled</Option>
                      <Option value="Yiminghe">yiminghe</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>

               <Col span={8} style={{marginBottom:'12px'}}>
                <Form.Item label="创建日期">
                  { getFieldDecorator('创建日期', {
                     rules: [{ type: 'array', required: false }],
                  })(
                     <RangePicker />
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

export default Form.create({ name: 'SelestForm' })(SelestForm);
