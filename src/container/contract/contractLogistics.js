import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import "./contractLogistics.scss"
import { Spin, Form, Input, Button, Cascader, Select, Checkbox, DatePicker, message } from 'antd';
import { Area } from '@lib/area2'
import ContractLogisticsRule from './contractLogisticsRule/contractLogisticsRule'
import { addContractTemplate, getContractDetail, updateContract } from 'api'

const { Option } = Select
const { RangePicker } = DatePicker;
const { TextArea } = Input;

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
  const contractLogisticsRule = useRef()
  const [form] = Form.useForm();
  const { ownerName, nick } = props.user || {}
  const [submitLoading, setSubmitLoading] = useState(false)
  const [initLoading, setInitLoading] = useState(false)
  const [id] = useState(() => {
    let match = /\?id=(\d+)/.exec(props.location.search)
    let id = match && match[1]
    return id
  })

  const [readOnly] = useState(() => {
    let match = /&readOnly=(\w*)/.exec(props.location.search)
    return !!(match && match[1])
  })
  /** 初始化 获取详情 */
  const init = () => {
    if (id) {
      setInitLoading(true)
      getContractDetail(id).then(res => {
        setInitLoading(false)
        if (!res) return
        const { contractMainDO: {
          contractNo,
          contractEndDate,
          contractStartDate,
          contractStatus,
          remarkInfo,
          ownerName,
          contractType,
          createrName,
          cappedPrice,
          gmtCreate,
          startPlace,
        }, contractTemplateRuleReqList } = res.data
        const initData = {
          contractNo,
          contractDate: [moment(new Date(contractStartDate), 'YYYY-MM-DD'), moment(new Date(contractEndDate), 'YYYY-MM-DD'),],
          contractStatus: !!(contractStatus === 1),
          remarkInfo,
          contractType,
          cappedPrice,
          ownerName,
          nick: createrName,
          startPlace: startPlace.split('_'),
          gmtCreate: moment(new Date(gmtCreate), 'YYYY-MM-DD'),
          contractTemplateItemReqList: contractTemplateRuleReqList
        }
        form.setFieldsValue(initData)
      })
    }
  }

  const onFinish = values => {
    // const rule = values.contractTemplateItemReqList
    const rule = contractLogisticsRule.current.submit()
    if (rule.length === 0) return message.error('请配置计费规则')
    for (let i = 0; i < rule.length; i++) {
      let item = rule[i]
      if (item.endPlaceList.length === 0) return message.error('目的地不能为空')
      if (item.heavyRuleDetailReqList.length === 0) return message.error('计费规则（重货）不能为空')
      if (item.lightRuleDetailReqList.length === 0) return message.error('计费规则（抛货）不能为空')
    }
    // 校验规则是否填写完整
    const params = {
      id,
      contractNo: values.contractNo,
      contractEndDate: values.contractDate[1].toDate(),
      contractStartDate: values.contractDate[0].toDate(),
      contractStatus: values.contractStatus ? 1 : 2,
      contractTemplateItemReqList: rule,
      startPlace: values.startPlace.join('_'),
      remarkInfo: values.remarkInfo,
      contractType: values.contractType,
    }
    const api = id ? updateContract : addContractTemplate

    setSubmitLoading(true)
    api(params).then(res => {
      if (!res) return setSubmitLoading(false)
      message.success('创建成功！')
      props.history.push('/sys/contract/contractList')
    })
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  useEffect(() => {
    init()
  }, [])

  return (
    <div className={`ContractLogistics ${readOnly ? 'readOnly' : ''}`}>
      <Spin tip="加载中..." spinning={initLoading}>
        <Form
          form={form}
          {...layout}
          name="basic"
          initialValues={{
            contractType: 1,
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
            label="合同编号"
            name="contractNo"
            rules={[
              {
                required: true,
                message: '请输入!',
              },
            ]}
          >
            <Input placeholder="请输入" disabled={readOnly} />
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
            <Checkbox disabled={readOnly} />
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
            <Cascader placeholder="请选择地区" options={Area} disabled={readOnly} />
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
            <RangePicker disabled={readOnly} />
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
            <ContractLogisticsRule ref={contractLogisticsRule} disabled={readOnly} />
          </Form.Item>
          <Form.Item
            label="备注"
            name="remarkInfo"
          >
            <TextArea />
          </Form.Item>
          <div style={{ width: '100%' }}></div>
          {
            !readOnly && <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit" loading={submitLoading}>
                提交</Button>
            </Form.Item>
          }
        </Form>
      </Spin>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user
})

export default connect(mapStateToProps)(ContractLogistics)