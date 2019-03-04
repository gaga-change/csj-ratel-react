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

### 三、打包方式

```
npm run build

```
### 四、目录结构

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

### 五、公共组件介绍
> 具体用法和antd一致,既antd所支持属性和方法以下组件都支持,只是对antd部分组件做了扩展和统一规范,以及将一些复杂的业务抽象出来，让使用者可以更简单的去使用

#### FetchTable
> 基础table组件，具体用法和antd一致

1. 可以不用设置key值,已经默认设置

2. 如果需要序号列,只需设置属性useIndex=true即可

3. 对于需要格式化类别的数据,只需要对列的配置项columns每列加上type属性即可,如需要格式化为时间的只需要加上type:'time'即可，同时你还可以加上format属性自定义时间展示格式，format:'YYYY-MM-DD'(可以参考moment),当然你也可以自行扩展

4. 对于本地枚举类格式化数据，只需要对列的配置项columns每列加上useLocalEnum属性即可,其属性值只要为src/lib/enum.js文件中对应的枚举变量名即可

主要逻辑

```
    columns=[
      { title:'计划出库时间',dataIndex:'planOutTime',type:'time'},
      { title:'单据状态',dataIndex:'planState',useLocalEnum:'outgoing_planStateEnum'}
    ]
    
    columns=columns.map((v,i)=>{
      v.key=i+1;
      if(v.type){ 
        switch(v.type){
          case 'time':v.render=(item)=>moment(Number(item)).format(v.format||'YYYY-MM-DD');break;
          default:break;
        }
      } else if(v.useLocalEnum){
        v.render=(item)=>Enum[v.useLocalEnum].find(eItem=>eItem.key===Number(item))&&Enum[v.useLocalEnum].find(eItem=>eItem.key===Number(item))['value']
      }
      return v;
    })

    if(Array.isArray(dataSource)){
      dataSource=dataSource.map((v,i)=>{
        if(!this.props.rowKey){
          v.key=i+1;
        }
        if(useIndex){
          v.index=i+1;
        }
        return v;
      }) 
    }
    
```

##### FetchTable props

| 属性  | 描述  |  类型 | 默认值 | 是否必填  |
| --- | --- |  --- | --- | --- | 
| useIndex |  是否使用序号索引，既上述2的描述  |  Boolean  | false  |  否  |

其余属性同antd

##### columns props

| 属性  | 描述  |  类型 | 默认值 | 是否必填  |
| --- | --- |  --- | --- | --- | 
| type |  格式化为何中数据如time,既上述3  |  String  | -  |  否  |
| useLocalEnum |  使用本地何种枚举,既上述4  |  String  | -  |  否  |

其余属性同antd