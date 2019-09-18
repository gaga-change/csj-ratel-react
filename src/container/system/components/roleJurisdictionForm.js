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
    halfCheckedKeys: [],
  }

  componentDidMount() {

  }

  componentWillReceiveProps(prevProps) {
    if (prevProps.goSubmit && !this.props.goSubmit) {
      this.handleSubmit()
    }
    if (this.props.checkedList !== prevProps.checkedList) {
      if (this.menuRoot) {
        this.setDefault(prevProps.checkedList)
      } else {
        this.initDicts().then(() => {
          this.setDefault(prevProps.checkedList)
        })
      }
    }
  }

  /**
   * 配置默认值
   */
  setDefault = (menus) => {
    // 如果父级未全选，则取消父级选中
    // 过滤父级
    let faIds = []
    const deep = (obj) => {
      const _ = obj => {
        let arr = obj.children
        if (arr && arr.length) {
          for (let i = 0; i < arr.length; i++) {
            let temp = arr[i]
            _(temp)
          }
          faIds.push(obj.id)
        }
      }
      _(obj)
    }
    deep(this.menuRoot)
    let faIdsStr = faIds.join(',') + ','
    menus = menus.map(v => v + '').filter(v => !~faIdsStr.indexOf(v))
    this.setState({ checkedKeys: menus.map(v => v + '') })
  }

  /**
  * 初始化获取权限列表
  */
  initDicts = () => {
    /** 获取权限列表 */
    return selectAllMenu().then(res => {
      if (!res) return
      res = res.data
      this.menuRoot = res
      sortMenu(res, item => {
        item.title = item.text
        item.key = item.id
      })
      this.setState({ treeData: res.children })
    })
  }

  handleSubmit = () => {
    // 添加 半选的父级
    return this.props.onSubmited(false, [...this.state.checkedKeys, ...this.state.halfCheckedKeys])
  }

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onCheck = (checkedKeys, e) => {
    this.setState({ checkedKeys, halfCheckedKeys: e.halfCheckedKeys });
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
          // checkStrictly
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