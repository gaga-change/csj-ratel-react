import React from 'react';
import Sider from '../../component/sider/sider'
import './stock.scss'

export default class Stock extends React.Component {
  render() {
    return (
      <div className="stock">
          <Sider history={this.props.history} />
          库存业务页面正在开发...
      </div>
    );
  }
}

