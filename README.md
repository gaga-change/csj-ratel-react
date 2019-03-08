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
> 具体用法和antd一致,既antd所支持属性和方法以下组件都支持,只是对antd部分组件做了扩展和统一规范,以及将一些复杂的业务抽象出来，让使用者可以更简单的去使用，对于嵌套表格可以参考入库业务和出库业务，因原antd使用简单，故未做封装

#### (1)、FetchTable
> 基础table组件，具体用法和antd一致,只是略作扩展

1. 可以不用设置key值,已经默认设置

2. 如果需要序号列,只需设置属性useIndex=true即可

3. 对于需要格式化类别的数据,只需要对列的配置项columns每列加上type属性即可,如需要格式化为时间的只需要加上type:'time'即可，同时你还可以加上format属性自定义时间展示格式,format:'YYYY-MM-DD'(可以参考moment),当然你也可以自行扩展

4. 对于本地枚举类格式化数据，只需要对列的配置项columns每列加上useLocalEnum属性即可,其属性值只要为src/lib/enum.js文件中对应的枚举变量名即可

5. 对于远端枚举类格式化数据，只需要对列的配置项columns每列加上useFetchMap属性即可,其属性值只要为src/publickApi/map.js文件中对应的相关请求名即可,我的做法是在用户登录后一次性把所有枚举类的请求都请求到全局,请放心这一块都是异步的不会影响页面响应速度

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
        v.render=(item)=>Enum[v.useLocalEnum].find(eItem=>eItem.key===(isNaN(item)?item:Number(item)))&&Enum[v.useLocalEnum].find(eItem=>eItem.key===(isNaN(item)?item:Number(item)))['value']
      } else if(v.useFetchMap){
        v.render=(item)=>mapSouce[v.useFetchMap].find(eItem=>eItem.key===(isNaN(item)?item:Number(item)))&&mapSouce[v.useFetchMap].find(eItem=>eItem.key===(isNaN(item)?item:Number(item)))['value']
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
| type |  格式化为何种数据如time,既上述3  |  String  | -  |  否  |
| format |  如果type为time,则可依照moment方式传递格式化类型  |  String  | 'YYYY-MM-DD'  |  否  |
| useLocalEnum |  使用本地何种枚举,既上述4  |  String  | -  |  否  |
| useFetchMap |  使用远端何种枚举,既上述5 |  String  | -  |  否  |

其余属性同antd

---------------------------------------------------------------------------------
#### (2)、SelectionTable 
> 多选table组件,具体用法和antd一致,只是略作扩展，如果页面没有多选需求，建议使用FetchTable,当然FetchTable所拥有的属性和方法该组件都有

1. onSelectChange和selectedRowKey是该组件的核心属性,selectedRowKey是当前选中的key值数组，多选的列是受控类型的，onSelectChange是选中后的回调，返回时选中的key值数组

2. 该组件支持前后端分页，但建议后端一次性把所有数据返回过来，全选支持选中当前页所有数据，也支持选中所有页数据，是一个下拉菜单

##### SelectionTable props

| 属性  | 描述  |  类型 | 默认值 | 是否必填  |
| --- | --- |  --- | --- | --- | 
| selectedRowKey |  当前选中数据的key值数组  |  Array  | []  |  是  |
| onSelectChange |  选中后的回调  |  Function(selectedRowKeys数组)  | -  |  是  |

其余属性同FetchTable

##### columns props

属性同FetchTable

--------------------------------------------------------------------------------------
#### (3)、EditableTable 
> 可编辑table组件，可实现双击单元格而实现可编辑状态，若无此类需求，建议使用FetchTable

1. EditableTable上的onChange方法和columns中的editable属性是该组件的核心属性,onChange是一个函数,当你在input中输入值改变的时候,他会将改变后的dataSource传递回去,editable是一个布尔型的属性,他决定了是否对于某个字段进行可编辑

2. columns还支持另外两个属性rules和inputType,rules和form表单中的一样,作为输入规则的校验,inputType是当前使用的input类型,默认为Input,你也可以使用InputNumber

columns案例:

```
  { title:'出库数量',dataIndex: 'planOutQty',editable:true,inputType:'InputNumber',width:120}

```

##### EditableTable props

| 属性  | 描述  |  类型 | 默认值 | 是否必填  |
| --- | --- |  --- | --- | --- | 
| onChange | 输入改变后的回调   |  Function(dataSource数组)  | -  |  是  |

其余属性同FetchTable

##### columns props

| 属性  | 描述  |  类型 | 默认值 | 是否必填  |
| --- | --- |  --- | --- | --- | 
| editable |  是否可编辑  |  Boolean  | false  |  否  |
| rules | 校验规则,同form   |  Array  | -  |  否  |
| inputType | input类型(Input|InputNumber)   |  String  | Input  |  否  |

其余属性同FetchTable

----------------------------------------------------------------------

#### (4)、BaseTitle 
> 小标题样式组件,为了大家把标题的样式写的统一一点,您也可以选择不使用
##### BaseTitle  props

| 属性  | 描述  |  类型 | 默认值 | 是否必填  |
| --- | --- |  --- | --- | --- | 
| title |  标题  |  String  | null  |  否  |


#### (5)、BaseCard 
> 该组件主要用于table查看详情时的基本信息卡片,可以参考入库业务点击table的详情弹窗

1. columns 和 dataSource是该组件的核心属性,dataSource是数据源,与table不同的是他的数据源是一个对象而并非数组,columns是配置属性,大体方式和table的columns相同,只不过目前仅支持(title,dataIndex,type,format,useLocalEnum,useFetchMap,render,span,marginBottom)
##### BaseCard  props

| 属性  | 描述  |  类型 | 默认值 | 是否必填  |
| --- | --- |  --- | --- | --- | 
| dataSource |  数据源  |  Object{}  | {}  |  是  |
| columns |  配置项目,以下会介绍 |  Array  | []  |  是  |

##### columns  props

| 属性  | 描述  |  类型 | 默认值 | 是否必填  |
| --- | --- |  --- | --- | --- | 
| title | 标题   |  String  | -  |  false  |
| dataIndex | 索引值   |  String  | -  |  false  |
| type |  格式化为何种数据如time,既上述3  |  String  | -  |  否  |
| format |  如果type为time,则可依照moment方式传递格式化类型  |  String  | 'YYYY-MM-DD'  |  否  |
| useLocalEnum |  使用本地何种枚举 |  String  | -  |  否  |
| useFetchMap |  使用远端何种枚举 |  String  | -  |  否  |
| render |  渲染函数,同antd |  Function  | -  |  否  |
| span |  栅格所占比例,同antd Col组件 |  Number  | 6  |  是  |
| marginBottom |  每列的下外边距 | Object   | -  |  false  |