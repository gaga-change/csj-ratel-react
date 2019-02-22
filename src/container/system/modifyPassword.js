import React from 'react';
import Sider from '../../component/sider/sider'
import './modifyPassword.scss'

export default class System extends React.Component {
  render () {
    return (
      <div className="ModifyPassword">
        <Sider history={this.props.history} />
        修改密码页面正在开发...
      </div>
    )
  }
}

