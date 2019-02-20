import React from 'react';
import  { Route,Switch,HashRouter,Redirect }  from  'react-router-dom';
import asyncComponent from './asyncComponent'
import { depthForEach } from '../lib/lib'
import { routerConfig } from './config'
class Router extends React.Component {
     render() {
         let config=depthForEach(routerConfig);
         return (
             <div>
                    <HashRouter basename="/" history={this.props.history}>
                        <Switch>
                            {
                              config.map(v=><Route exact={v.path==='/'||v.path==='/system'}   path={v.path} key={v.path} component={asyncComponent(()=>import(`../container${v.component}`))}/>)
                            }
                            <Redirect to='/'></Redirect>
                        </Switch>
                    </HashRouter>
             </div>
         );
    }
 }
export default Router;