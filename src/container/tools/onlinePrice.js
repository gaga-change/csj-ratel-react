import React, { useEffect, useState, useRef } from 'react'
import debounce from 'lodash/debounce';
import { connect } from 'react-redux'
import moment from 'moment'
import "./onlinePrice.scss"
import { Area, turnAddress } from '@lib/area2'
import ShowPrice from './onlinePriceComponents/showPrice'
import DisposalDetail from './onlinePriceComponents/disposalDetail'
import ExpressDetail from './onlinePriceComponents/expressDetail'
import { Spin, Form, Card, Button, Cascader, Divider, InputNumber, Select, Checkbox, DatePicker } from 'antd';
import { getOutBusiBill, contractCostEstimate, getOutBusiBillDetail } from 'api'
const { Option } = Select

const layout = {
  layout: 'inline',
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const typeOptions = [
  { label: '商品价', value: 1 },
  { label: '运输费', value: 2 },
  { label: '处置费', value: 3 },
];

const OnlinePrice = (props) => {
  const tick = useRef()
  const [form] = Form.useForm()
  const { ownerName, nick } = props.user || {}
  const [fetchOrderListLoading, setFetchOrderListLoading] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [orderList, setOrderList] = useState([])
  const [orderDetail, setOrderDetail] = useState(null)

  const init = () => {
    // setFetchOrderListLoading(true)
    // getOutBusiBill({ pageNum: 1, pageSize: 999 }).then(res => {
    //   setFetchOrderListLoading(false)
    //   if (!res) return
    //   setOrderList(res.data.list)
    // })
  }

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

  /**  */
  const handleBusiBillNoChnage = busiBillNo => {
    console.log('chnage', busiBillNo)
    setDetailLoading(true)
    getOutBusiBillDetail({ billNo: orderList.find(v => v.busiBillNo === busiBillNo).billNo }).then(res => {
      setDetailLoading(false)
      if (!res) return
      const { arrivalAddress } = res.data
      // 处理地址
      console.log(turnAddress(arrivalAddress))

      // form.setFieldsValue({
      //   endPlace: []
      // })
    })
  }

  const fetch = val => setTimeout(() => {
    setFetchOrderListLoading(true)
    getOutBusiBill({ pageNum: 1, pageSize: 20, busiBillNo: val }).then(res => {
      setFetchOrderListLoading(false)
      if (!res) return
      setOrderList(res.data.list)
    })
  }, 800)

  const handleSearch = val => {
    if (tick.current) {
      clearTimeout(tick.current)
    }
    tick.current = fetch(val)
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <div
      className="ContractOnlinePrice"
    >
      <Spin tip="加载中..." spinning={detailLoading}>
        <Form
          form={form}
          {...layout}
          name="basic"
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
            label="关联业务订单"
            name="busiBillNo"
            rules={[
              {
                required: true,
                message: '请输入!',
              },
            ]}
          >
            <Select onChange={handleBusiBillNoChnage}
              loading={true}
              showSearch
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              onSearch={handleSearch}
              notFoundContent={fetchOrderListLoading ? <Spin size="small" /> : null}

            >
              {
                (orderList || []).map(v => <Option key={v.billNo} value={v.busiBillNo}>{v.busiBillNo}</Option>)
              }
            </Select>
          </Form.Item>
          <Form.Item
            label="所在仓库"
            name="AAAA"
            rules={[
              {
                required: true,
                message: '请输入!',
              },
            ]}
          >
            <Select >
              <Option value={0}>BB</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="运输方式"
            name="transportType"
            rules={[
              {
                required: true,
                message: '请输入!',
              },
            ]}
          >
            <Select >
              <Option value={0}>物流运输</Option>
              <Option value={1}>快递运输</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="是否加托"
            name="palletType"
            rules={[
              {
                required: true,
                message: '请输入!',
              },
            ]}
          >
            <Select >
              <Option value={1}>不加托</Option>
              <Option value={2}>木托，60元</Option>
              <Option value={2}>塑料托，80元</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="原寄地"
            name="startPlace"
            rules={[
              {
                required: true,
                message: '请输入!',
              },
            ]}
          >
            <Cascader placeholder="请选择地区" options={Area} />
          </Form.Item>
          <Form.Item
            label="目的地"
            name="endPlace"
            rules={[
              {
                required: true,
                message: '请输入!',
              },
            ]}
          >
            <Cascader placeholder="请选择地区" options={Area} />
          </Form.Item>
          <Form.Item
            label="重量"
            name="weight"
            rules={[
              {
                required: true,
                message: '请输入!',
              },
            ]}
          >
            <InputNumber min={0.001} max={99999999} placeholder="请输入！" style={{ width: '100%' }} precision={3} setp={1} />
          </Form.Item>
          <Form.Item
            label="体积"
            name="volume"
            rules={[
              {
                required: true,
                message: '请输入!',
              },
            ]}
          >
            <InputNumber min={0.001} max={99999999} placeholder="请输入！" style={{ width: '100%' }} precision={3} setp={1} />
          </Form.Item>
          <Form.Item
            label="邮寄时间"
            name="mailDate"
            rules={[
              {
                required: true,
                message: '请输入!',
              },
            ]}
          >
            <DatePicker showTime />
          </Form.Item>
          <Form.Item
            label="费用类型"
            name="costType"
            rules={[
              {
                required: true,
                message: '请输入!',
              },
            ]}
          >
            <Checkbox.Group options={typeOptions} />
          </Form.Item>
          <div style={{ width: '100%' }}>
            <Button className="mr20" style={{ float: 'right' }} type="primary" htmlType="button">费用估算</Button>
          </div>
          <Divider />
          {/* <div className="mt15" style={{ width: '100%' }} ></div> */}
          <Card style={{ width: '100%' }}>
            <DisposalDetail />
            <ExpressDetail className="mt10" />
          </Card>
          <div className="mt15" style={{ width: '100%' }}> </div>
          <Card style={{ width: '100%' }}>
            <ShowPrice></ShowPrice>
          </Card>
        </Form>
      </Spin></div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user
})

export default connect(mapStateToProps)(OnlinePrice)