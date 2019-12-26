import React from 'react'
import { Form, Input, Cascader, Select } from 'antd'
import { depthForEachCascader } from '@lib/lib'
import { findLeaf } from '@lib'
import { saleTypeEnum } from 'lib/enum'
import { skuCategoryTrees } from 'api'
import './addform.scss'

const { Option } = Select
const { TextArea } = Input

class AddForm extends React.Component {

  state = {
    categoryTrees: [],
    activeCascader: {}
  }

  componentDidMount() {
    this.props.onRef(this)
    this.fetch().then(() => {
      if (this.props.visible) {
        this.initData(this.props.row)
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.visible && nextProps.visible) {
      this.initData(nextProps.row)
    }
  }


  /** 初始化表单 */
  initData(row) {
    if (!row) {
      let keys = ['skuName', 'ownerSkuCode', 'categoryCode', 'brandName', 'skuUnitName', 'skuFormat', 'skuModel', 'saleType', 'remarkInfo']
      let obj = {}
      keys.forEach(key => {
        obj[key] = undefined
      })
      obj.saleType = 1
      this.props.form.setFieldsValue(obj)
      return
    }
    let keys = ['skuName', 'ownerSkuCode', 'brandName', 'skuUnitName', 'skuFormat', 'skuModel', 'saleType', 'remarkInfo']
    let obj = {}
    keys.forEach(key => {
      obj[key] = row[key]
    })
    this.props.form.setFieldsValue(obj)
    // 查找分类...  初始化分类
    let path = findLeaf(this.categoryTreesRoot, 'children', obj => obj.currentCode === row.categoryCode)
    if (path && path.length) {
      path.shift()
      let temp = path.map(v => v.currentCode)
      this.props.form.setFieldsValue({ categoryCode: temp })
      this.setState({
        activeCascader: {
          categoryCode: row.categoryCode,
          categoryName: row.categoryName
        }
      })
    } else {
      this.props.form.setFieldsValue({ categoryCode: [] })
    }
  }

  handleSubmit = (e) => {
    let { activeCascader } = this.state
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit({ ...values, ...activeCascader })
      }
    })
  }

  handleRest = () => {
    this.props.form.resetFields()
    this.setState({ activeCascader: {} })
  }

  fetch = () => {
    return skuCategoryTrees().then(res => {
      if (!res) return
      res = res.data
      this.categoryTreesRoot = res || {}
      this.setState({
        categoryTrees: (res && res.children) || []
      })
    })
  }

  onChange = (value, selectedOptions) => {
    if(value.length<3){
      return
    }
    let { activeCascader } = this.state
    activeCascader = selectedOptions[selectedOptions.length - 1]
    this.setState({
      activeCascader: {
        categoryCode: activeCascader.value,
        categoryName: activeCascader.label
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    let { categoryTrees } = this.state
    categoryTrees = depthForEachCascader(categoryTrees)
    const formItemLayout_left = {
      labelCol: {
        span: 7
      },
      wrapperCol: {
        span: 17
      },
      style: {
        width: 300,
        height: 60
      }
    }

    const formItemLayout_right = {
      labelCol: {
        span: 8
      },
      wrapperCol: {
        span: 16
      },
      style: {
        width: 400,
      }
    }

    const checkLength = (rule, value, callback) => {
      if (!this.props.form.getFieldValue('categoryCode') || this.props.form.getFieldValue('categoryCode').length<3) {
        callback('第三级分类必选')
      } else {
        callback()
      }
    }

    return (
      <div className="AddForm">
        <Form
          layout="inline"
          onSubmit={this.handleSubmit} >
          <Form.Item label="商品名称" {...formItemLayout_left}>
            {getFieldDecorator('skuName', {
              initialValue: '',
              rules: [{ required: true, message: '请输入商品名称' }],
            })(
              <Input autoComplete='off' placeholder="请输入商品名称" />
            )}
          </Form.Item>

          <Form.Item label="商品分类" {...formItemLayout_right}>
            {getFieldDecorator('categoryCode', {
              initialValue: [],
              rules: [{ required: true, validator: checkLength }],
            })(
              <Cascader options={categoryTrees} onChange={this.onChange} placeholder="请选择商品分类" />
            )}
          </Form.Item>
          <Form.Item label="货主商品编码" {...formItemLayout_left}>
            {getFieldDecorator('ownerSkuCode', {
            })(
              <Input autoComplete='off' placeholder="请输入货主商品编码" />
            )}
          </Form.Item>
          <Form.Item label="品牌" {...formItemLayout_right}>
            {getFieldDecorator('brandName', {
              initialValue: '',
              rules: [{ required: true, message: '请输入品牌' }],
            })(
              <Input autoComplete='off' placeholder="请输入品牌" />
            )}
          </Form.Item>
          <Form.Item label="单位" {...formItemLayout_left}>
            {getFieldDecorator('skuUnitName', {
              initialValue: '',
              rules: [{ required: true, message: '请输入单位' }],
            })(
              <Input autoComplete='off' placeholder="请输入单位" />
            )}
          </Form.Item>
          <Form.Item label="规格" {...formItemLayout_right}>
            {getFieldDecorator('skuFormat', {
              initialValue: '',
              rules: [{ required: true, message: '请输入规格' }],
            })(
              <Input autoComplete='off' placeholder="请输入规格" />
            )}
          </Form.Item>
          <Form.Item label="型号" {...formItemLayout_left}>
            {getFieldDecorator('skuModel', {
              initialValue: '',
              rules: [{ required: true, message: '请输入型号' }],
            })(
              <Input autoComplete='off' placeholder="请输入型号" />
            )}
          </Form.Item>
          <Form.Item label="在库区分" {...formItemLayout_right}>
            {getFieldDecorator('saleType', {
              initialValue: 1
            })(
              <Select>
                {saleTypeEnum.map((v, index) => <Option value={v.value} key={index}>{v.name}</Option>)}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="商品描述" {...formItemLayout_left} style={{ height: 100, width: 300 }}>
            {getFieldDecorator('remarkInfo', {
              initialValue: '',
              rules: [{ required: false }],
            })(
              <TextArea rows={4} placeholder="请输入商品描述" />
            )}
          </Form.Item>
        </Form>
      </div>)
  }
}

export default Form.create({ name: 'AddForm' })(AddForm)
