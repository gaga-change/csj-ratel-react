// import React from 'react'
// import ReactDOM from 'react-dom'
// import zhCN from 'antd/lib/locale-provider/zh_CN'
// import moment from 'moment'
// import 'moment/locale/zh-cn'

// import { LocaleProvider  } from 'antd'
// import { createStore,applyMiddleware,compose } from 'redux'
// import {Provider} from 'react-redux'
// import thunk from 'redux-thunk'
// import reducers from './reducers'
// import SussLayout from "./layout/layout"
// import './index.scss'
// moment.locale('zh-cn')
// const  reduxDevtools=window.__REDUX_DEVTOOLS_EXTENSION__?window.__REDUX_DEVTOOLS_EXTENSION__():f=>f
// const store=createStore(reducers,compose(
//     applyMiddleware(thunk),
//     reduxDevtools
// ))

// ReactDOM.render( 
// <Provider  store={store}>
//   <LocaleProvider locale={zhCN}>
//     <SussLayout/> 
//   </LocaleProvider>
//   </Provider>, document.getElementById('root'))




import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { LocaleProvider } from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './reducers/index'

const store = createStore(rootReducer)

moment.locale('zh-cn')

// import axios from 'axios'
// document.addEventListener('click', e => {
//   let id = e.target.getAttribute('data-rule-id')
//   if (id) {
//     let name = e.target.innerHTML
//     let menu = window.MENU_MAP[window.location.pathname]
//     if (!menu) return console.error('菜单不存在')
//     let parentId = menu.id
//     axios.post('/webApi/base/menu/add', { "menuName": name.trim(), "menuType": 1, "menuPath": id, "pageComponent": 0, "orderNum": null, "hidden": "0", "parentId": parentId })
//   }
// })

ReactDOM.render(<Provider store={store}><LocaleProvider locale={zh_CN}><App /></LocaleProvider></Provider>, document.getElementById('root'))

serviceWorker.register()

