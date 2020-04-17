import React from 'react'
import { Route, Switch, Redirect } from "react-router-dom"
import Home from 'container/home/home'
import Warehousing from 'container/warehousing/warehousing'
import Outgoing from 'container/outgoing/outgoing'
import Commodity from 'container/commodity/commodity'
import Stock from 'container/stock/stock'
import Customer from 'container/customer/customer'
import Provider from 'container/provider/provider'
import Role from 'container/system/role'
import Menu from 'container/system/menu'
import User from 'container/system/user'
import OnlinePrice from 'container/tools/onlinePrice'
import SetPass from 'container/system/setPass'
import reportList from 'container/report/reportList'
import { withRouter } from "react-router"

class Content extends React.Component {
  render() {
    const { match } = this.props
    return (
      <Switch>
        <Route exact path={`${match.path}/home`} component={Home} />
        <Route exact path={`${match.path}/warehousing`} component={Warehousing} />
        <Route exact path={`${match.path}/outgoing`} component={Outgoing} />
        <Route exact path={`${match.path}/commodity`} component={Commodity} />
        <Route exact path={`${match.path}/stock`} component={Stock} />
        <Route exact path={`${match.path}/customer`} component={Customer} />
        <Route exact path={`${match.path}/system/role`} component={Role} />
        <Route exact path={`${match.path}/system/user`} component={User} />
        <Route exact path={`${match.path}/system/setPass`} component={SetPass} />
        <Route exact path={`${match.path}/system/menu`} component={Menu} />
        <Route exact path={`${match.path}/tools/onlinePrice`} component={OnlinePrice} />
        <Route exact path={`${match.path}/provider`} component={Provider} />
        <Route exact path={`${match.path}/reportList`} component={reportList} />
        <Redirect to={`${match.path}/home`} />
      </Switch>
    )
  }
}
export default withRouter(Content)