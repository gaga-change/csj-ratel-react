import React from 'react'
import { Form, Input, Switch, Radio, Tree } from 'antd'
const { TextArea } = Input
const RadioGroup = Radio.Group;
const { TreeNode } = Tree;

/**
 * props:
 *  goSubmit<Boolean> 是否进行表单提交操作。如果 false->true 则会提交表单
 *  onSubmited<Function> 表单提交结束。通知父组件将goSubmit修改为 false
 *      @returns err,values
 */
class DataForm extends React.Component {
  state = {
  }

  componentWillReceiveProps(prevProps) {
    if (prevProps.goSubmit && !this.props.goSubmit) {
      this.handleSubmit()
    }
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  handleSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      this.props.onSubmited(err, values)
    })
  }

  handleRest = () => {
    this.props.form.resetFields()
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { obj = {}, menus = {} } = this.props
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item
          {...formItemLayout}
          label="菜单名称"
        >
          {getFieldDecorator('menuName', {
            rules: [{
              required: true, message: '请输入菜单名称！', whitespace: true,
            }],
            initialValue: obj.menuName
          })(
            <Input maxLength={50} />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="类型选择"
        >
          {getFieldDecorator('menuType', {
            initialValue: obj.menuType || 0
          })(
            <RadioGroup>
              <Radio value={0}>菜单</Radio>
              <Radio value={1}>按钮</Radio>
            </RadioGroup>
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="菜单URL"
        >
          {getFieldDecorator('menuPath', {
            rules: [{
              required: true, message: '请输入菜单URL！', whitespace: true,
            }],
            initialValue: obj.menuPath
          })(
            <Input maxLength={50} />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="菜单权限"
        >
          {getFieldDecorator('menuPerms', {
            rules: [{
              required: true, message: '请输入菜单权限！', whitespace: true,
            }],
            initialValue: obj.menuPerms
          })(
            <Input maxLength={50} />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="容器路由"
        >
          {getFieldDecorator('pageComponent', {
            rules: [{
              required: true, message: '请输入容器路由！', whitespace: true,
            }],
            initialValue: obj.pageComponent
          })(
            <Input maxLength={50} />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="菜单图标"
        >
          {getFieldDecorator('menuIcon', {
            rules: [{
              required: true, message: '请输入菜单图标！', whitespace: true,
            }],
            initialValue: obj.menuIcon
          })(
            <Input maxLength={50} />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="显示顺序"
        >
          {getFieldDecorator('orderNum', {
            rules: [{
              required: true, message: '请输入显示顺序！', whitespace: true,
            }],
            initialValue: obj.orderNum
          })(
            <Input maxLength={50} />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="是否显示"
        >
          {getFieldDecorator('hidden', {
            rules: [{
              required: true, message: '请输入显示顺序！', whitespace: true,
            }],
            initialValue: obj.hidden
          })(
            <Switch checkedChildren="显示" unCheckedChildren="隐藏" defaultChecked />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="备注"
        >
          {getFieldDecorator('remarkInfo', {
            rules: [{
              required: true, message: '请输入菜单名称！', whitespace: true,
            }],
            initialValue: obj.remarkInfo
          })(
            <TextArea rows={3} maxLength={200} />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="上级菜单"
        >
          {getFieldDecorator('menuName', {
            rules: [{
              required: true, message: '请输入菜单名称！', whitespace: true,
            }],
            initialValue: obj.menuName
          })(
            <Input maxLength={50} />
          )}
        </Form.Item>

      </Form>
    )
  }
}

const MenuAddForm = Form.create({ name: 'menu_add_form' })(DataForm)
export default MenuAddForm