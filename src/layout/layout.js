import React from 'react';
import Router from "../router/router";
import './layout.scss'

export default class SussLayout extends React.Component {
  componentDidMount(){
    document.querySelector('.layout-box').style.minHeight=document.body.clientWidth+'px'
  }
  render() {
    return <div className="layout-box">
          <section className="mian-container">
            <Router/>
          </section>
    </div>
  }
}

