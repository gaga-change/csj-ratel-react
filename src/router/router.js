import React from 'react';
import  { Route,Switch,HashRouter,Redirect }  from  'react-router-dom';
import {connect} from 'react-redux';
import Loadable from 'react-loadable';
import MyLoadingComponent from './MyloadingComponent'
import { depthForEach } from '../lib/lib'
@connect(
 state=>state.menus,
)
class Router extends React.Component {
     render() {
         let config=depthForEach(this.props.menus);
         return (
             <div>
                    <HashRouter basename="/" history={this.props.history}>
                        <Switch>
                            {
                              config.map(v=>{

                                let  BasicLayout = Loadable({
                                    loader: () => import(`../container${v.component}`),
                                    loading: MyLoadingComponent
                                });

                                return <Route 
                                  exact={v.path==='/'||v.path==='/system'}   
                                  path={v.path} key={v.path} 
                                  component={BasicLayout}/>
                              })
                            }
                            <Redirect to='/login'></Redirect>
                        </Switch>
                    </HashRouter>
             </div>
         );
    }
 }
export default Router;