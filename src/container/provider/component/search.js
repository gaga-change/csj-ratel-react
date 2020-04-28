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
        for (let i in values) {
          if (Array.isArray(values[i]) && !values[i].length) {
            delete values[i]
          } else if ([undefined, 'undefined', ''].includes(values[i])) {
            delete values[i]
          }
        }
        this.props.onSubmit(values)
      }
    });
  }

  handleRest = () => {
    this.props.form.resetFields();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { selectWordsArr = [], submitTex = "查询", resetText = "重置" } = this.props;

    return (
      <div className="CommodityForm">
        <Form onSubmit={this.handleSubmit} layout="inline">
          <Row gutter={24}>
            {
              selectWordsArr.includes('供应商名称') &&
              <Col span={12} style={{ width: '360px', marginBottom: '12px' }}>
                <Form.Item label="供应商名称">
                  {getFieldDecorator('providerName', {
                    initialValue: '',
                    rules: [{ required: false, message: '' }],
                  })(
                    <Input autoComplete='off' placeholder="请输入供应商名称" />
                  )}
                </Form.Item>
              </Col>
            }
            <Col span={24}>
              <Form.Item>
                <Button
                  type="primary"
                  style={{ marginRight: '12px' }}
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
