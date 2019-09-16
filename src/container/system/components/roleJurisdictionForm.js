import React from 'react';
import { Tree } from 'antd';
import { sortMenu } from '@lib'
import { selectAllMenu } from 'api'
const { TreeNode } = Tree;

/**
 * props:
 *  checkedList<Array(int)> 已拥有权限
 *  goSubmit<Boolean> 是否进行表单提交操作。如果 false->true 则会提交表单
 *  onSubmited<Function> 表单提交结束。通知父组件将goSubmit修改为 false
 *      @returns err,values
 */
class DataForm extends React.Component {

  state = {
    expandedKeys: [],
    autoExpandParent: true,
    checkedKeys: [],
    selectedKeys: [],
    treeData: [],
  }

  componentDidMount() {
    this.initDicts()
  }

  componentWillReceiveProps(prevProps) {
    if (prevProps.goSubmit && !this.props.goSubmit) {
      this.handleSubmit()
    }
    if (this.props.checkedList !== prevProps.checkedList) {
      this.setDefault(prevProps.checkedList)
    }
  }

  /**
   * 配置默认值
   */
  setDefault = (menus) => {
    this.setState({ checkedKeys: menus.map(v => v + '') })
  }

  /**
  * 初始化获取权限列表
  */
  initDicts = () => {
    /** 获取权限列表 */
    selectAllMenu().then(res => {
      if (!res) return
      res = res.data
      sortMenu(res, item => {
        item.title = item.text
        item.key = item.id
      })
      this.setState({ treeData: res.children })
    })
  }

  handleSubmit = () => {
    return this.props.onSubmited(false, JSON.parse(JSON.stringify(this.state.checkedKeys)))
  }

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onCheck = checkedKeys => {
    this.setState({ checkedKeys });
  };

  renderTreeNodes = (data = []) => {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children || [])}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...item} />;
    })
  }

  render() {
    let { treeData } = this.state
    return (
      <div>
        <Tree
          checkable
          onExpand={this.onExpand}
          expandedKeys={this.state.expandedKeys}
          autoExpandParent={this.state.autoExpandParent}
          onCheck={this.onCheck}
          checkedKeys={this.state.checkedKeys}
          selectedKeys={this.state.selectedKeys}
        >
          {this.renderTreeNodes(treeData)}
        </Tree>
      </div>
    )
  }
}

export default DataForm