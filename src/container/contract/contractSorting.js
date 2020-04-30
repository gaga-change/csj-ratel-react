import React, { useRef, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import "./contractSorting.scss"
import SetWeightRule from './contractSortingRule/setWeightRule'
import { Form, Input, Button, Divider, InputNumber, Spin, Select, Checkbox, DatePicker, message } from 'antd';
import { addContractTemplate, getContractDetail, updateContract } from 'api'

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

const UnitPrice = props => (<div style={{ display: 'flex', alignItems: 'center' }}>
  <InputNumber {...props} min={0} max={99999999} step={1} precision={2} style={{ flex: 1 }} />
  <span className="ml10">元</span>
</div>)

const ContractSorting = (props) => {
  const [form] = Form.useForm();
  const setWeightRule = new useRef()
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
        }, contractSortingRulesDOList } = res.data
        const initData = {
          contractNo,
          contractDate: [moment(new Date(contractStartDate), 'YYYY-MM-DD'), moment(new Date(contractEndDate), 'YYYY-MM-DD'),],
          contractStatus: !!(contractStatus === 1),
          remarkInfo,
          contractType,
          cappedPrice,
          ownerName,
          nick: createrName,
          gmtCreate: moment(new Date(gmtCreate), 'YYYY-MM-DD'),
          contractSortingReqList: contractSortingRulesDOList
        }
        form.setFieldsValue(initData)
      })
    }
  }
  const onFinish = values => {
    let res = setWeightRule.current.submit()
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
      id,
    }
    const api = id ? updateContract : addContractTemplate
    setSubmitLoading(true)
    api(params).then(res => {
      if (!res) return setSubmitLoading(false)
      message.success('创建成功！')
      props.history.push('/sys/contract/contractList?contractType=3')
    })
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  useEffect(() => {
    init()
  }, [])

  return (
    <div className={`ContractSorting ${readOnly ? 'readOnly' : ''}`}>
      <Spin tip="加载中..." spinning={initLoading}>
        <Form
          form={form}
          {...layout}
          name="basic"
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
            label="合同有效期"
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
            label="封顶价"
            name="cappedPrice"
            rules={[
              {
                required: true,
                message: '请输入!',
              },
            ]}
          >
            <UnitPrice />
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
            <SetWeightRule ref={setWeightRule} disabled={readOnly} />
          </Form.Item>
          <div style={{ width: '100%' }}></div>
          <Form.Item {...tailLayout}>
            {
              !readOnly && <Button className="mr15" type="primary" htmlType="submit" loading={submitLoading}>
                提交</Button>}
            <Button type="primary" htmlType="button" onClick={() => props.history.go(-1)}>
              返回
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user
})

export default connect(mapStateToProps)(ContractSorting)