import React, { useRef, useState } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import "./contractSorting.scss"
import SetWeightRule from './contractSortingRule/setWeightRule'
import { Form, Input, Button, Divider, InputNumber, Select, Checkbox, DatePicker, message } from 'antd';
import { addContractTemplate } from 'api'

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

const ContractSorting = (props) => {
  const test = new useRef()
  const { ownerName, nick } = props.user || {}
  const [submitLoading, setSubmitLoading] = useState(false)
  const onFinish = values => {
    let res = test.current.submit()
    if (!res) {
      return
    }
    // 校验规则是否填写完整
    const params = {
      contractNo: values.contractNo,
      contractEndDate: values.contractDate[1].toDate(),
      contractStartDate: values.contractDate[0].toDate(),
      contractStatus: values.contractStatus ? 1 : 2,
      remarkInfo: values.remarkInfo,
      contractType: values.contractType,
      cappedPrice: values.cappedPrice,
      contractSortingReqList: res,
    }
    setSubmitLoading(true)
    addContractTemplate(params).then(res => {
      if (!res) return setSubmitLoading(false)
      message.success('创建成功！')
      props.history.push('/sys/contract/contractList')
    })
    console.log(params)
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form

      {...layout}
      name="basic"
      className="ContractSorting"
      initialValues={{
        contractType: 3,
        ownerName,
        nick,
        cappedPrice: undefined,
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
        name="contractType"
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
        label="封顶价"
        name="cappedPrice"
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
        style={{ width: '100%' }}
        wrapperCol={
          {
            offset: 0,
            span: 24,
          }
        }
        name="contractSortingReqList"
      >
        <SetWeightRule ref={test} />
      </Form.Item>
      {/* <Form.Item
        label="备注"
        name="remarkInfo"
      >
        <TextArea />
      </Form.Item> */}
      <div style={{ width: '100%' }}></div>
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit" loading={submitLoading}>
          提交
        </Button>
      </Form.Item>
    </Form>
  );
};

const mapStateToProps = (state) => ({
  user: state.user
})

export default connect(mapStateToProps)(ContractSorting)