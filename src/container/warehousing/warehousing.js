import React from 'react';
import Sider from '../../component/sider/sider'
import './warehousing.scss'

export default class Warehousing extends React.Component {
  render() {
    return (
      <div className="Warehousing">
          <Sider history={this.props.history} />
          入库业务页面正在开发...
      </div>
    );
  }
}

