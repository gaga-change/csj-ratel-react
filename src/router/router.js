import React from 'react';
import  { Route,Switch,Redirect,BrowserRouter }  from  'react-router-dom';
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
                    <BrowserRouter basename="/" history={this.props.history}>
                        <Switch>
                            {
                              config.map(v=>{

                                let  BasicLayout = Loadable({
                                    loader: () => import(`../container${v.component}`),
                                    loading: MyLoadingComponent
                                });

                                return <Route 
                                  strict={true}
                                  exact={v.path==='/'||v.path==='/system'}   
                                  path={v.path} key={v.path} 
                                  component={BasicLayout}/>
                              })
                            }
                            <Redirect to='/web_login'></Redirect>
                        </Switch>
                    </BrowserRouter>
             </div>
         );
    }
 }
export default Router;