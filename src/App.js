import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"
import './App.scss'
import 'antd/dist/antd.css'
import Login from 'container/login/login'
import Sys from './Sys'
import { connect } from 'react-redux'

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route path="/sys" component={Sys} />
            <Route exact path="/web_login" component={Login} />
            <Redirect to="/web_login" />
          </Switch>
        </div>
      </Router>
    )
  }
}

export default connect()(App)
