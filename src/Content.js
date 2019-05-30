import React from 'react'
import { Route, Switch } from "react-router-dom"
import Home from 'container/home/home'
import Warehousing from 'container/warehousing/warehousing'
import Outgoing from 'container/outgoing/outgoing'
import Commodity from 'container/commodity/commodity'
import Stock from 'container/stock/stock'
import Customer from 'container/customer/customer'
import Role from 'container/system/role'
import Menu from 'container/system/menu'
import User from 'container/system/user'
import SetPass from 'container/system/setPass'
import { withRouter } from "react-router"

class Content extends React.Component {
  render() {
    const { match } = this.props
    return (
      <div>
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
        </Switch>
      </div>
    )
  }
}
export default withRouter(Content)