import React from 'react';
import Sider from '../../component/sider/sider'
import './system.scss'

export default class System extends React.Component {
  render() {
    return (
      <div className="System">
          <Sider history={this.props.history}/>
          系统业务页面正在开发...
      </div>
    );
  }
}

