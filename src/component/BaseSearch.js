import React, { useEffect, forwardRef, useImperativeHandle } from 'react'
import '@ant-design/compatible/assets/index.css';
import { Form } from '@ant-design/compatible';
import { Input, Select, Button, Card, DatePicker } from 'antd';
import './BaseSearch.scss'
import * as Enum from '@lib/enum'


const { Option } = Select

/*
 vertical = true // 默认确认按钮是垂直的
 onSubmit = Function // 提交回调参数
 const config = [
  { label: '质检单号', prop: 'orderCode' },
  { label: '创建时间', prop: 'createTimeArea', props: ['startDate', 'endDate'], type: 'timeArea' },
  { label: '库区性质', prop: 'warehouseAreaNature', type: 'enum', enum: 'warehouseAreaNatureEnum' },
]
 */

const BaseSearch = (props, ref) => {
  const [form] = Form.useForm();
  const { config, onSubmit, initialValues = {} } = props
  /** 校验配置信息是否正确 */
  const check = () => {

    config.forEach(item => {
      switch (item.type) {
        case 'enum':
          if (!Enum[item.enum]) console.error(`枚举【${item.enum}】不存在`)
          break
        default:
          break
      }
    })
  }

  useEffect(() => {
    check()
  }, [])

  const layout = {
    layout: 'inline',
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  }

  const onFinish = values => {
    config.forEach(item => {
      if (item.type === 'time' && values[item.prop]) {
        values[item.prop] = values[item.prop].format('YYYY-MM-DD')
      }
    })
    onSubmit && onSubmit(values)
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  }

  const handleSubmit = () => {
    form.submit()
  }

  const handleRest = () => {
    form.resetFields()
    form.submit()
  }

  const FormItmes = props => {
    const { item } = props
    const { type } = item
    if (type === 'time') return <DatePicker {...props} placeholder="请选择" onChange={(...args) => {
      props.onChange(...args)
      handleSubmit()
    }} />
    if (type === 'enum') return <Select  {...props} placeholder="请选择" onChange={(...args) => {
      props.onChange(...args)
      handleSubmit()
    }}>
      {
        (Enum[item.enum] || []).map(v => <Option key={v.value} value={v.value}>{v.name}</Option>)
      }
    </Select>
    return <Input {...props} placeholder="请输入" />
  }

  useImperativeHandle(ref, () => ({
    form
  }))

  useEffect(() => {
    form.submit()
  }, [])

  return (
    <div className="BaseSearch mb15">
      <Card>
        <Form
          form={form}
          {...layout}
          name="basic"
          className=""
          initialValues={initialValues}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          {
            config.map(item => (
              <Form.Item
                label={item.label}
                name={item.prop}
                key={item.prop}
              >
                <FormItmes item={item} />
              </Form.Item>
            ))
          }
        </Form>
        <div>
          <Button
            type="primary"
            onClick={handleSubmit}
            style={{ marginRight: '12px' }}
            htmlType="button">
            查询</Button>
          <Button
            type="primary"
            onClick={handleRest}
            htmlType="button">
            重置</Button>
        </div>
      </Card>
    </div>
  )
}
export default forwardRef(BaseSearch)
