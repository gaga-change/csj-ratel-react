import React from 'react'
import { Form, Input, Switch, Radio, Tree, InputNumber } from 'antd'
const { TextArea } = Input
const RadioGroup = Radio.Group;
const { TreeNode } = Tree;


class SelectMenu extends React.Component {
  constructor(props) {
    super(props)
    const value = props.value || ''
    this.state = {
      expandedKeys: [],
      autoExpandParent: true,
      selectedKeys: value ? [value + ''] : [],
    }
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }

  onSelect = (selectedKeys, info) => {
    this.setState({ selectedKeys })

    const onChange = this.props.onChange
    if (onChange) {
      onChange(selectedKeys[0])
    }
  }

  renderTreeNodes = data => data.map((item) => {
    if (item.children) {
      return (
        <TreeNode title={item.title} key={item.key} dataRef={item} disabled={this.props.obj && Number(item.key) === Number(this.props.obj.id)}>
          {this.renderTreeNodes(item.children)}
        </TreeNode >
      )
    }
    return <TreeNode {...item} disabled={this.props.obj && Number(item.key) === Number(this.props.obj.id)}/>
  })
  render() {
    let { menus = {} } = this.props
    return (
      <Tree
        onExpand={this.onExpand}
        expandedKeys={this.state.expandedKeys}
        autoExpandParent={this.state.autoExpandParent}
        onSelect={this.onSelect}
        selectedKeys={this.state.selectedKeys}
      >
        {this.renderTreeNodes(menus.children || [])}
      </Tree>
    )
  }
}

/**
 * props:
 *  goSubmit<Boolean> 是否进行表单提交操作。如果 false->true 则会提交表单
 *  onSubmited<Function> 表单提交结束。通知父组件将goSubmit修改为 false
 *      @returns err,values
 */
class DataForm extends React.Component {

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
    let { obj = {} } = this.props
    obj = obj || {}
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
          label="菜单路径"
        >
          {getFieldDecorator('menuPath', {
            rules: [{
              required: true, message: '请输入菜单路径！', whitespace: true,
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
            initialValue: obj.orderNum || 1
          })(
            <InputNumber min={1} max={100000} />,
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="是否显示"
        >
          {getFieldDecorator('hidden', {
            valuePropName: 'checked',
            initialValue: !(obj.hidden === '1'),
          })(
            <Switch checkedChildren="显示" unCheckedChildren="隐藏" />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="备注"
        >
          {getFieldDecorator('remarkInfo', {
            initialValue: obj.remarkInfo
          })(
            <TextArea rows={3} maxLength={200} />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="上级菜单"
        >
          {getFieldDecorator('parentId', {

          })(
            <SelectMenu menus={this.props.menus} obj={obj} />
          )}
        </Form.Item>

      </Form>
    )
  }
}

const MenuAddForm = Form.create({ name: 'menu_add_form' })(DataForm)
export default MenuAddForm