import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { ConfigProvider } from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './reducers/index'

const store = createStore(rootReducer)

moment.locale('zh-cn')

ReactDOM.render(<Provider store={store}><ConfigProvider locale={zh_CN}><App /></ConfigProvider ></Provider>, document.getElementById('root'))

serviceWorker.unregister()

