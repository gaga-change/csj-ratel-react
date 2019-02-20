import React from 'react';
import Sider from '../../component/sider/sider'
import './outgoing.scss'

export default class Outgoing extends React.Component {
  render() {
    return (
      <div className="Outgoing">
          <Sider history={this.props.history} />
           出库业务正在开发...
      </div>
    );
  }
}

