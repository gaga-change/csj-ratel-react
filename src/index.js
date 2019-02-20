import React from 'react';
import ReactDOM from 'react-dom';
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
  <SussLayout/> 
</Provider>, document.getElementById('root'));
