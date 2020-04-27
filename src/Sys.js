import React, { Component } from 'react'
import { Layout, Menu, Icon, Dropdown } from 'antd'
import { connect } from 'react-redux'
import { setUser } from 'actions'
import { Link } from 'react-router-dom'
import MyContent from './Content'
import imgSouce from 'imgSouce/imgSouce'
import { loginOut, userInfo } from 'api'
import { connectSocket } from 'api/socket'
import { deep, sortMenu } from 'lib'
import './Sys.scss'

const { Header, Sider, Content } = Layout
const { SubMenu } = Menu

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: true,
      DEV: !!window.localStorage.getItem('DEV')
    }
  }

  componentDidMount() {
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.id = 'otherdatascript'
    script.src = `http://bi.csjmro.com/WebReport/ReportServer?op=fs_load&cmd=sso&fr_username=${'huozhu@163.com'}&fr_password=${'eabd8ce9404507aa8c22714d3f5eada9'}&validity=-1&callback=fwie`
    document.body.appendChild(script)
    window.fwie = function (data) {
      // 成功后删除script及回调方法
      const script = document.getElementById('otherdatascript')
      document.body.removeChild(script)
      delete window['fwie']
    }
    userInfo().then(res => {
      if (!res) return
      let user = res.data
      connectSocket(user)
      let temp = {}
      let styleNameArr = []
      user.menus = user.menus || { children: [] }
      sortMenu(user.menus, item => {
        if (item.path && item.type === 0) {
          temp['/sys' + item.path] = { ...item, children: undefined }
        }
      }, v => {
        if (v.type === 1) {
          styleNameArr.push(`[data-rule-id='${v.path}']`)
        }
        return v.type === 0 || v.type === 2
      })
      let ele = document.getElementById('USER_RULE')
      if (!ele) {
        ele = document.createElement('style')
        ele.id = 'USER_RULE'
      }
      ele.innerHTML = styleNameArr.join(',') + '{ display: inline-block !important;}'
      document.body.appendChild(ele)
      window.MENU_MAP = temp
      res && this.props.dispatch(setUser(res.data))
    })
  }

  /** 菜单点击 */
  handleMenuClick(menu) {
    if (menu.type === 2) { // 外链点击跳转
      window.open(menu.path)
    } else {
      this.props.history.replace(`/sys` + menu.path)
    }
  }

  /** 退出登录 */
  logOut = () => {
    this.props.history.push('/web_login')
    loginOut()
  }

  render() {
    const { pathname, search } = this.props.location
    const { user } = this.props
    const { ownerName, nick } = user || {}
    const menus = (user && user.menus) || {}
    let menusRoot = [...(menus.children || [])]
    const defaultSelectedKeys = []
    deep(menus, 'children', v => {
      if (('/sys' + v.path) === pathname || ('/sys' + v.path) === pathname + search) {
        defaultSelectedKeys.push(v.id)
      }
    })
    if (pathname === '/sys/home') {
      defaultSelectedKeys.push('0')
    } else if (pathname === '/sys/system/menu') {
      defaultSelectedKeys.push('999')
    }

    menusRoot.unshift({
      id: 0,
      text: '首页',
      path: '/home',
      icon: 'home'
    })

    const menu = (
      <Menu>
        <Menu.Item>
          <span className="siderNav_header_Nav" onClick={this.logOut}>退出登录</span>
        </Menu.Item>
        <Menu.Item>
          <Link to='/sys/system/setPass' replace>
            <span className="siderNav_header_Nav">修改密码</span>
          </Link>
        </Menu.Item>
      </Menu>
    )
    return (
      <div className="Sys">
        <Layout>
          <Sider className="Sider" trigger={null} collapsible collapsed={this.state.collapsed}>
            <div className="logo" />
            {
              defaultSelectedKeys.length && <Menu mode="inline" defaultSelectedKeys={defaultSelectedKeys}>
                {
                  menusRoot.map(menuFa =>
                    (menuFa.children && menuFa.children.length) ? (
                      <SubMenu
                        key={menuFa.id}
                        title={
                          <span className="menu-item">
                            <img src={imgSouce[`${menuFa.icon}_click`]} alt="" />
                            <span>{menuFa.text}</span>
                          </span>
                        }
                      >
                        {menuFa.children.map(menu =>
                          <Menu.Item key={menu.id} onClick={this.handleMenuClick.bind(this, menu)}>
                            {/* <Icon type="user" /> */}
                            <span>{menu.text}</span>
                          </Menu.Item>
                        )}
                        {/* {this.state.DEV && <Menu.Item key={999} onClick={this.handleMenuClick.bind(this, { path: '/system/menu' })}>
                          <span>菜单管理</span>
                        </Menu.Item>} */}
                      </SubMenu>
                    ) : (
                        <Menu.Item key={menuFa.id} onClick={this.handleMenuClick.bind(this, menuFa)}>
                          {/* <Icon type="user" /> */}
                          <span className="menu-item">
                            <img src={imgSouce[`${menuFa.icon}_click`]} alt="" />
                            <span>{menuFa.text}</span>
                          </span>
                        </Menu.Item>
                      )
                  )
                }
              </Menu>
            }
          </Sider>
          <Layout>
            <Header >
              <div className="header-logo">
                <img src={imgSouce['logo']} alt="" />
                <span>川山甲 货主平台</span>
              </div>
              <a href="http://help.csjscm.com/#/newsWeb/list?systemId=fe6b09cd31cb47ed837a6ab26c910fa4" className="f12 mr20" target="_blank" rel="noopener noreferrer">在线帮助文档</a>
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
            </Header>
            <Content>
              <MyContent />
            </Content>
          </Layout>
        </Layout>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user
})

export default connect(mapStateToProps)(App)