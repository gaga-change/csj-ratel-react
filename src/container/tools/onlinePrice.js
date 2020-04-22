import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import "./onlinePrice.scss"
import { Form, Input, Button, Divider, InputNumber, Select, Checkbox, DatePicker } from 'antd';
const { Option } = Select
const { RangePicker } = DatePicker;


const layout = {
  layout: 'inline',
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const OnlinePrice = (props) => {
  const { ownerName, nick } = props.user || {}
  const onFinish = values => {
    // 校验规则是否填写完整
    const params = {
      // contractNo: values.contractNo,
      // contractEndDate: values.contractDate[1].toDate(),
      // contractStartDate: values.contractDate[0].toDate(),
      // contractStatus: values.contractStatus ? 1 : 2,
      // remarkInfo: values.remarkInfo,
      // templateType: values.templateType,
      // contractWarehouseTemplateReq: {
      //   ruleType: values.ruleType,
      //   unitPrice: values.unitPrice,
      // }
    }
    console.log(params)
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form

      {...layout}
      name="basic"
      className="ContractOnlinePrice"
      initialValues={{
        templateType: 2,
        ownerName,
        nick,
        unitPrice: undefined,
        ruleType: 0,
        contractStatus: true,
        contractDate: undefined,
        nowDate: moment(new Date(), 'YYYY-MM-DD'),
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="模板编号"
        name="contractNo"
        rules={[
          {
            required: true,
            message: '请输入!',
          },
        ]}
      >
        <Input placeholder="请输入" />
      </Form.Item>
      <Form.Item
        label="货主"
        name="ownerName"
        rules={[
          {
            required: true,
            message: '请输入!',
          },
        ]}
      >
        <Input disabled />
      </Form.Item>
      <Form.Item
        label="合同类型"
        name="templateType"
        rules={[
          {
            required: true,
            message: '请输入!',
          },
        ]}
      >
        <Select disabled>
          <Option value={0}>运输快递合同</Option>
          <Option value={1}>运输物流合同</Option>
          <Option value={2}>仓储费合同</Option>
          <Option value={3}>分拣处置费</Option>
          <Option value={4}>增值费合同</Option>
        </Select>
      </Form.Item>
      <Form.Item
        label="启用"
        name="contractStatus"
        valuePropName="checked"
        rules={[
          {
            required: true,
            message: '请输入!',
          },
        ]}
      >
        <Checkbox />
      </Form.Item>

      <Form.Item
        label="合同日期"
        name="contractDate"
        rules={[
          {
            required: true,
            message: '请输入!',
          },
        ]}
      >
        <RangePicker />
      </Form.Item>
      <Form.Item
        label="登记人"
        name="nick"
        rules={[
          {
            required: true,
            message: '请输入!',
          },
        ]}
      >
        <Input disabled />
      </Form.Item>
      <Form.Item
        label="登记日期"
        name="nowDate"
        rules={[
          {
            required: true,
            message: '请输入!',
          },
        ]}
      >
        <DatePicker disabled />
      </Form.Item>
      <Divider />
      <Form.Item
        label="计费单价"
        name="unitPrice"
        rules={[
          {
            required: true,
            message: '请输入!',
          },
        ]}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <InputNumber min={0} max={99999999} step={1} precision={2} style={{ flex: 1 }} />
          <span className="ml10">元</span>
        </div>
      </Form.Item>
      <Form.Item
        label=""
        labelCol={
          {
            span: 0,
          }
        }
        name="ruleType"
        rules={[
          {
            required: true,
            message: '请输入!',
          },
        ]}
      >
        <Select>
          <Option value={0}>立方米/天(按体积)</Option>
          <Option value={1}>托盘/天(按托盘)</Option>
          <Option value={2}>平方米/天(按面积)</Option>
        </Select>
      </Form.Item>
      {/* <Form.Item
        style={{ width: '100%' }}
        wrapperCol={
          {
            offset: 0,
            span: 24,
          }
        }
        name="contractTemplateItemReqList"
      >
        <ContractOnlinePriceRule />
      </Form.Item> */}
      {/* <Form.Item
        label="备注"
        name="remarkInfo"
      >
        <TextArea />
      </Form.Item> */}
      <div style={{ width: '100%' }}></div>
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
  );
};

const mapStateToProps = (state) => ({
  user: state.user
})

export default connect(mapStateToProps)(OnlinePrice)