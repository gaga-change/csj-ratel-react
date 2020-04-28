import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import "./onlinePrice.scss"
import { Area } from '@lib/area2'
import ShowPrice from './onlinePriceComponents/showPrice'
import DisposalDetail from './onlinePriceComponents/disposalDetail'
import ExpressDetail from './onlinePriceComponents/expressDetail'
import { Spin, Form, Card, Button, Input, Cascader, Divider, InputNumber, Select, Checkbox, DatePicker, message } from 'antd';
import { getOutBusiBill, contractCostEstimate, getOutBusiBillDetail } from 'api'
import { palletTypeEnum } from '@lib/enum'
import UnitInput from '@component/UnitInput'
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
  const [submitLoading, setSubmitLoading] = useState(false)
  const [orderList, setOrderList] = useState([])
  const [orderDetail, setOrderDetail] = useState({})
  const [costType, setCostType] = useState([])
  const [result, setResult] = useState(null)

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
    let { endPlace, mailDate, startPlace, transportType } = values
    if (transportType === 0) {
      endPlace = [...endPlace].splice(0, 1)
    } else {
      endPlace = [...endPlace].splice(0, 2)
    }
    const params = {
      ...values,
      endPlace: endPlace.join('_'),
      goodsPrice: orderDetail.planOutAmt,
      mailDate: mailDate.toDate(),
      startPlace: startPlace.join('_'),
    }
    setCostType(values.costType)
    setSubmitLoading(true)
    contractCostEstimate(params).then(res => {
      setSubmitLoading(false)
      if (!res) return
      if (!res.data) {
        message.warning('该订单无法估算！')
      } else {
        setResult(res.data)
      }
    })
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  /** 表单提交 查询 */
  const handleSubmit = () => {
    form.submit()
  }

  /**  */
  const handleBusiBillNoChange = busiBillNo => {
    setResult(null)
    setDetailLoading(true)
    getOutBusiBillDetail({ billNo: orderList.find(v => v.busiBillNo === busiBillNo).billNo }).then(res => {
      setDetailLoading(false)
      if (!res) return
      const { arrivalAddress, warehouseAddress, warehouseName } = res.data
      setOrderDetail(res.data)
      // 处理地址
      form.setFieldsValue({
        endPlace: autoReadAddress(arrivalAddress),
        startPlace: autoReadAddress(warehouseAddress),
        warehouseName,
      })
    })
  }

  /** 查询订单列表 */
  const fetch = val => setTimeout(() => {
    setFetchOrderListLoading(true)
    getOutBusiBill({ pageNum: 1, pageSize: 20, busiBillNo: val }).then(res => {
      setFetchOrderListLoading(false)
      if (!res) return
      setOrderList(res.data.list)
    })
  }, 800)

  /** 搜索事件 */
  const handleSearch = val => {
    if (tick.current) {
      clearTimeout(tick.current)
    }
    tick.current = fetch(val)
  }

  /** 地址自动识别 */
  const autoReadAddress = address => {
    let res = []
    if (!address) return res
    for (let i = 0; i < Area.length; i++) {
      let province = Area[i]
      if (~address.indexOf(province.label.substr(0, 2))) {
        res.push(province)
        for (let j = 0; j < province.children.length; j++) {
          let city = province.children[j]
          if (~address.indexOf(city.label)) {
            res.push(city)
            for (let j = 0; j < city.children.length; j++) {
              let area = city.children[j]
              if (~address.indexOf(area.label)) {
                res.push(area)
                break
              }
            }
            break
          }
        }
        break
      }
    }
    return res.map(v => v.value)
  }

  useEffect(() => {
    const match = /busiBillNo=([^&]*)&billNo=([^&]*)/g.exec(props.location.search)
    init()
    if (match && match[1]) {
      const busiBillNo = match[1]
      const billNo = match[2]
      form.setFieldsValue({ busiBillNo: match[1] })
      orderList.push({ busiBillNo, billNo })
      setOrderList([...orderList])
      handleBusiBillNoChange(match[1])
    }

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
            palletType: 1,
            transportType: 0,
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
                message: '请输入',
              },
            ]}
          >
            <Select onChange={handleBusiBillNoChange}
              loading={true}
              showSearch
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              onSearch={handleSearch}
              placeholder="请输入订单号"
              notFoundContent={fetchOrderListLoading ? <Spin size="small" /> : null}
            >
              {
                (orderList || []).map(v => <Option key={v.billNo} value={v.busiBillNo}>{v.busiBillNo}</Option>)
              }
            </Select>
          </Form.Item>
          <Form.Item
            label="所在仓库"
            name="warehouseName"
            rules={[
              {
                required: true,
                message: '请输入',
              },
            ]}
          >
            <Input disabled></Input>
          </Form.Item>
          <Form.Item
            label="运输方式"
            name="transportType"
            rules={[
              {
                required: true,
                message: '请输入',
              },
            ]}
          >
            <Select >
              <Option value={0}>快递运输</Option>
              <Option value={1}>物流运输</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="是否加托"
            name="palletType"
            rules={[
              {
                required: true,
                message: '请输入',
              },
            ]}
          >
            <Select >
              {palletTypeEnum.map(v => <Option key={v.value} value={v.value}>{v.name}</Option>)}
            </Select>
          </Form.Item>
          <div style={{ width: '100%' }}></div>
          <Form.Item
            label="原寄地"
            name="startPlace"
            rules={[
              {
                required: true,
                message: '请输入',
              },
            ]}
          >
            <Cascader placeholder="请选择地区" options={Area} />
          </Form.Item>
          {/* <div>{orderDetail.warehouseAddress || ''}</div> */}
          <Form.Item
            label=""
          >
            {orderDetail.warehouseAddress || ''}
          </Form.Item>
          <div style={{ width: '100%' }}></div>
          <Form.Item
            label="目的地"
            name="endPlace"
            rules={[
              {
                required: true,
                message: '请输入',
              },
            ]}
          >
            <Cascader placeholder="请选择地区" options={Area} />
          </Form.Item>
          <Form.Item
            label=""
          >
            {orderDetail.arrivalAddress || ''}
          </Form.Item>
          <div style={{ width: '100%' }}></div>
          <Form.Item
            label="重量"
            name="weight"
            rules={[
              {
                required: true,
                message: '请输入',
              },
            ]}
          >
            <UnitInput unit="Kg">
              <InputNumber min={0.001} max={99999999} placeholder="请输入" style={{ width: '100%' }} precision={3} setp={1} />
            </UnitInput>
          </Form.Item>
          <Form.Item
            label="体积"
            name="volume"
          >
            <UnitInput unit="M3">
              <InputNumber min={0.001} max={99999999} placeholder="请输入" style={{ width: '100%' }} precision={3} setp={1} />
            </UnitInput>
          </Form.Item>
          <Form.Item
            label="邮寄时间"
            name="mailDate"
            rules={[
              {
                required: true,
                message: '请输入',
              },
            ]}
          >
            <DatePicker format="YYYY-MM-DD HH:mm" showTime />
          </Form.Item>
          <Form.Item
            label="费用类型"
            name="costType"
            rules={[
              {
                required: true,
                message: '请输入',
              },
            ]}
          >
            <Checkbox.Group options={typeOptions} />
          </Form.Item>
          <div style={{ width: '100%' }}>
            <Button className="mr20" style={{ float: 'right' }} type="primary" htmlType="button" onClick={handleSubmit} loading={submitLoading}>费用估算</Button>
          </div>
          {
            (!!result) && (<div style={{ width: '100%' }}>
              <Divider />
              {
                (costType.includes(2) || costType.includes(3)) &&
                <Card style={{ width: '100%' }}>
                  {costType.includes(2) && <ExpressDetail result={result} />}
                  {costType.includes(3) && <DisposalDetail className="mt10" result={result} />}
                </Card>
              }
              <div className="mt15" style={{ width: '100%' }}> </div>
              {costType.includes(1) && <Card style={{ width: '100%' }}>
                <ShowPrice result={result}></ShowPrice>
              </Card>}
            </div>)
          }

        </Form>
      </Spin></div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user
})

export default connect(mapStateToProps)(OnlinePrice)