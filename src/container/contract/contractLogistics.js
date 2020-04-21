import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import "./contractLogistics.scss"
import { Form, Input, Button, Cascader, Select, Checkbox, DatePicker, message } from 'antd';
import { Area } from '@lib/area2'
import ContractLogisticsRule from './contractLogisticsRule/contractLogisticsRule'
const { Option } = Select
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const cityList = Area.map(v => ({ label: v.label, value: v.value, children: v.children.map(v => ({ ...v, children: undefined })) }))

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

const ContractLogistics = (props) => {
  const { ownerName, nick } = props.user || {}
  const onFinish = values => {
    const rule = values.contractTemplateItemReqList
    if (rule.length === 0) return message.error('请配置计费规则')
    for (let i = 0; i < rule.length; i++) {
      let item = rule[i]
      if (item.endPlaceList.length === 0) return message.error('目的地不能为空')
      if (item.heavyRuleDetailReqList.length === 0) return message.error('计费规则（重货）不能为空')
      if (item.lightRuleDetailReqList.length === 0) return message.error('计费规则（抛货）不能为空')
    }
    // 校验规则是否填写完整
    const params = {
      contractNo: values.contractNo,
      contractEndDate: values.contractDate[1].toDate(),
      contractStartDate: values.contractDate[0].toDate(),
      contractStatus: values.contractStatus ? 1 : 2,
      contractTemplateItemReqList: values.contractTemplateItemReqList,
      startPlace: values.startPlace.join('_'),
      remarkInfo: values.remarkInfo,
      templateType: values.templateType,
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
      className="ContractLogistics"
      initialValues={{
        templateType: 1,
        ownerName,
        nick,
        contractStatus: true,
        startPlace: undefined,
        contractDate: undefined,
        nowDate: moment(new Date(), 'YYYY-MM-DD'),
        contractTemplateItemReqList: [],
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
        label="出发地"
        name="startPlace"
        rules={[
          {
            required: true,
            message: '请输入!',
          },
        ]}
      >
        <Cascader placeholder="请选择地区" options={cityList} />
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
      <Form.Item
        style={{ width: '100%' }}
        wrapperCol={
          {
            offset: 0,
            span: 24,
          }
        }
        name="contractTemplateItemReqList"
      >
        <ContractLogisticsRule />
      </Form.Item>
      <Form.Item
        label="备注"
        name="remarkInfo"
      >
        <TextArea />
      </Form.Item>
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

export default connect(mapStateToProps)(ContractLogistics)