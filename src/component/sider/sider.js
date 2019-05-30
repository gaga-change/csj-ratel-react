import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Dropdown, Icon, Breadcrumb } from 'antd';
import request from '../../lib/request'
import { deepExistMenu, depthForEach } from '../../lib/lib'
import { routerConfig } from '../../router/config'
import imgSouce from '../../imgSouce/imgSouce'
import { connect } from 'react-redux'
import './sider.scss'
import { loginOut } from 'api'

// @connect(
//   state => state,
//   { setInfo, setMenus, removeInfo, setMap }
// )

class Sider extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isLoginPage: this.props.history.location.pathname === '/web_login'
    }
  }

  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.querySelector('.SiderNav').style.minHeight = document.body.clientWidth + 'px';
    this.spin()
  }

  componentDidUpdate() {
    document.querySelector('.SiderNav').style.minHeight = document.body.clientWidth + 'px';
  }

  spin = () => {
    const { isLoginPage } = this.state
    if ((!this.props.info || !this.props.info.info || this.props.info.info.id === undefined) && !isLoginPage) {
      this.getInfo()
    }
  }

  getInfo = () => {
    request({
      url: '/webApi/base/user/info',
      method: 'get',
    }).then(res => {
      if (res) {
        this.props.setInfo(res)
        this.props.setMenus(deepExistMenu(res.menus.children, routerConfig))
        this.props.setMap()
      }
    }).catch(err => {
    })
  }

  logOut = () => {
    this.props.removeInfo();
    this.props.history.push('/web_login')
    loginOut()
  }

  BreadcrumbFn({ history, menus, ...rest }) {
    let pathArr = history.location.pathname.slice(1).split('/');
    let menu = depthForEach(menus.menus);
    pathArr = pathArr.map((v, i) => '/' + pathArr.slice(0, i + 1).join('/')).map(v => menu.find(item => item.path === v));
    return pathArr.length > 1 ? <Breadcrumb style={{ marginBottom: 12 }}>
      {
        pathArr.map((v, i) => i !== pathArr.length - 1 ?
          <Breadcrumb.Item key={i}> <Link to={v.path} replace>{v.name}</Link></Breadcrumb.Item>
          : <Breadcrumb.Item key={i}>{v.name}</Breadcrumb.Item>)
      }
    </Breadcrumb> : null
  }

  render() {
    const { ownerName, nick } = (this.props.info && this.props.info.info) || {};
    let activePath = this.props.history && this.props.history.location && this.props.history.location.pathname;
    let arr = activePath && activePath.split('/');
    if (arr.length > 2) {
      activePath = `/${arr[1]}`
    }
    const config = this.props.menus && this.props.menus.menus && Array.isArray(this.props.menus.menus) && this.props.menus.menus.filter(v => !v.hidden).sort((a, b) => a.sort - b.sort);
    const uesHover = this.props.uesHover !== undefined ? this.props.uesHover : true;
    const { isLoginPage } = this.state;

    const menu = (
      <Menu>
        <Menu.Item>
          <span className="siderNav_header_Nav" onClick={this.logOut}>退出登录</span>
        </Menu.Item>
        <Menu.Item>
          <Link to='/system/setPass' replace>
            <span className="siderNav_header_Nav">修改密码</span>
          </Link>
        </Menu.Item>
      </Menu>
    );

    return (
      <div className="siderNav_box">
        <div className="SiderNav" style={{ minHeight: this.props.minHeight ? this.props.minHeight : '800px', display: isLoginPage ? 'none' : 'block' }}>
          <ul>
            {
              config.map(v =>
                <li key={v.id || v.path} className={activePath === v.path || activePath === v.Redirect ? 'active' : null}>
                  <Link to={v.Redirect || v.path} replace>
                    <img src={activePath === v.path || activePath === v.Redirect ? imgSouce[`${v.icon}_click`] : imgSouce[v.icon]} alt="" />
                    <span>{v.name}</span>
                  </Link>
                  {
                    v.children && Array.isArray(v.children) && uesHover &&
                    <div className="li_hover">
                      <ul>
                        {
                          v.children.filter(v => !v.hidden).sort((a, b) => a.sort - b.sort).map(item =>
                            <li key={item.id || item.path}>
                              <Link to={item.path} replace>
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

        <div className="logonHeader" style={{ paddingLeft: isLoginPage ? '0' : '50px' }}>
          <header id="header">
            <div className="header-logo" style={{ paddingLeft: isLoginPage ? '24px' : '20px' }}>
              <img src={imgSouce['logo']} alt="" />
              {
                !isLoginPage &&
                <span>川山甲 SAASERP</span>
              }
              {
                isLoginPage &&
                <div className="logo_text">
                  <h3>川山甲 SAASERP</h3>
                  <span>协同供应链 .仓配一体化 .仓储租赁</span>
                </div>
              }
            </div>
            {
              !isLoginPage &&
              <div className="header-set">
                <Dropdown overlay={menu}>
                  <span className="ant-dropdown-link header_set_content" >
                    <p className="user-area">
                      <span className="user-name">{nick}</span>
                      <span className="company-name">{ownerName}</span>
                    </p>
                    <Icon type="down" />
                  </span>
                </Dropdown>
              </div>
            }
          </header>
        </div>
        <this.BreadcrumbFn {...this.props} />
      </div>
    )
  }
}

export default connect()(Sider)