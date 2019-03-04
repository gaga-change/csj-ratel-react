### 一、知识参考

1. [React.js](https://reactjs.org/)

2. [ECMAScript 6 入门](http://es6.ruanyifeng.com/)

3. [Ant Design](https://ant.design/index-cn)

4. [Moment.js](http://momentjs.cn/)

5. [Lodash](https://www.lodashjs.com/docs/4.17.5.html)

### 二、启动方式

```
npm run start

```
### 三、目录结构

```
/
 ├── build/                          # 打包后自动生成
 │
 ├── src/                           # 项目开发目录
 │      ├── component/              # 组件
 │      ├── container/              # 页面
 │      ├── imgSouce/               # 图片资源
 │      ├── layout/                 # 页面基础布局
 │      ├── lib/                    # 公共函数库(请求、方法、枚举)
 │      ├── publickApi/             # 公共api
 │      ├── redux/                  # redux状态管理
 │      ├── router/                 # 路由配置
 │      └── index.js                # 项目入口
 │
 ├── config/                        # 工程配置
 │      │
 │      ├── webpack.config.js # webpack基础环境配置文件
 │      │
 │      └── webpackDevServer.config.js  # webpack开发环境配置文件
 │
 │
 │
 ├── public/                        # 库文件等，不会被webpack的loader处理,手动管理
 │      │
 │      ├── favicon.ico             # 站标
 │      │
 │      └── index.html              # 项目入口
 │
 ├── node_modules/                  # 自动生成 包含生产依赖及开发依赖
 │
 ├── package.json                   # 项目配置文件
 │
 └── README.md                      # 项目说明

```

