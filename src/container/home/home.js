import React from 'react';
import Sider from '../../component/sider/sider'
import './home.scss';
export default class Home extends React.Component {
  render() {
    return (
      <div className="Home">
          <Sider history={this.props.history} />
          主页正在开发...
      </div>
    );
  }
}

