import React from 'react';
import Sider from '../../component/sider/sider'
import SelestForm from './component/form'
import './warehousing.scss'

export default class Warehousing extends React.Component {

  onSubmit = (type,value)=>{
    console.log(type,value)
  }

  render() {
    return (
      <div className="Warehousing">
          <Sider history={this.props.history} />
          <SelestForm
            onSubmit={this.onSubmit.bind(this,'add')}/>
      </div>
    );
  }
}

