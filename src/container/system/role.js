import React from 'react';
import Sider from '../../component/sider/sider'
import './style/role.scss'

export default class Role extends React.Component {
  render() {
    return (
      <div className="Role">
          <Sider history={this.props.history}/>
          角色管理页面正在开发...
      </div>
    );
  }
}

