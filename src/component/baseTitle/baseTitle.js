import React from 'react';
import './baseTitle.scss'
export default class BaseTitle extends React.Component {
  render() {
    let { title } = this.props;
    return (
      <div className="BaseTitle">
        <div className="BaseTitle_icon"/> 
        <div className="BaseTitle_title">{title}</div>
      </div>
    );
  }
}

