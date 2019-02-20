import React from 'react';
import  { Link }  from  'react-router-dom';
import {connect} from 'react-redux';
import { setInfo } from "../../redux/info.redux";
import { routerConfig } from '../../router/config'
import imgSouce from '../../imgSouce/imgSouce'
import './sider.scss'

@connect(
  state=>state.info,
  { setInfo }
)

export default class Sider extends React.Component {

  componentDidMount(){
    document.querySelector('.SiderNav').style.minHeight=document.body.clientWidth+'px'
  }

  render() {
    let activePath=this.props.history&&this.props.history.location&&this.props.history.location.pathname;
    let arr=activePath&&activePath.split('/');
    if(arr.length>2){
      activePath=`/${arr[1]}`
    }
    const config=routerConfig.filter(v=>!v.hidden);
    const uesHover=this.props.uesHover!==undefined?this.props.uesHover:true;
    let isLoginPage=this.props.history&&this.props.history.location&&this.props.history.location.pathname==='/login'
    return (
      <div className="siderNav">
        <div className="SiderNav" style={{minHeight:this.props.minHeight?this.props.minHeight:'800px',display:isLoginPage?'none':'block'}}>
          <ul>
            {
              config.map(v=>
              <li key={v.id||v.path} className={activePath===v.path?'active':null}>
                <Link to={v.path} replace>
                  <img src={activePath===v.path?imgSouce[`${v.icon}_click`]:imgSouce[v.icon]} alt=""/>
                  <span>{v.name}</span>
                </Link>
                { 
                  v.children&&uesHover&&
                  <div className="li_hover">
                     <ul>
                       {
                         v.children.map(item=>
                          <li key={item.id||item.path}>
                            <Link to={item.path}  replace>
                               {item.name}
                            </Link>
                          </li>
                        )
                       }
                     </ul>
                  </div>
                }
              </li>)
            }
          </ul>
        </div>

        <div className="logonHeader" style={{paddingLeft:isLoginPage?'0':'50px'}}>
            <header id="header">
                  <div className="header-logo" style={{paddingLeft:isLoginPage?'24px':'20px'}}>
                    <img src={imgSouce['logo']} alt=""/>
                    {
                      !isLoginPage&&
                      <span>川山甲 SAASERP</span>
                    }
                    { 
                      isLoginPage&&
                      <div className="logo_text">
                        <h3>川山甲 SAASERP</h3>
                        <span>协同供应链 .仓配一体化 .仓储租赁</span>
                      </div>
                    }
                  </div>
                  <div className="header-set">

                  </div>
              </header>
        </div>
      </div>
    );
  }
}

