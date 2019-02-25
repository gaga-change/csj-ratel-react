import React from 'react';
import Sider from '../../component/sider/sider'
import './user.scss'

export default class User extends React.Component {
  render() {
    return (
      <div className="User">
          <Sider history={this.props.history}/>
          用户管理页面正在开发...
      </div>
    );
  }
}

