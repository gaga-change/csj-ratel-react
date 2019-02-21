import React from 'react';
import ReactDOM from 'react-dom';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { LocaleProvider  } from 'antd';
import { createStore,applyMiddleware,compose } from 'redux';
import {Provider} from 'react-redux'
import thunk from 'redux-thunk';
import reducers from './reducers';
import SussLayout from "./layout/layout";
import './index.scss';

const  reduxDevtools=window.devToolsExtension?window.devToolsExtension():f=>f;
const store=createStore(reducers,compose(
    applyMiddleware(thunk),
    reduxDevtools
))

ReactDOM.render( 
<Provider  store={store}>
  <LocaleProvider locale={zhCN}>
    <SussLayout/> 
  </LocaleProvider>
</Provider>, document.getElementById('root'));
