import React from 'react';
import { Menu, Dropdown, Icon } from 'antd';
import Sider from '../../component/sider/sider'
import FetchTable from '../../component/fetchTable/fetchTable'
import SelestForm from './component/form'
import { indexTableColumns_Config,indexTableColumns_ChildConfig } from './component/config'
import './warehousing.scss'




export default class Warehousing extends React.Component {
  constructor(props){
    super(props);
    this.state={
      dataSource:[
      {
        id:1,
        childData:[
          {id:3},
          {id:4},
        ]
      },
      {
        id:2,
        key:2,
        childData:[
          {id:5},
          {id:6},
        ]
      },
      {
        id:3,
        key:3,
        childData:[
          {id:7},
          {id:8},
        ]
      }
    ],
      columns:indexTableColumns_Config
    }
  }

  onSubmit = (type,value)=>{
    console.log(type,value)
  }

  componentDidMount(){
    let {columns}=this.state;
    columns.map(v=>{
       if(v.render!==undefined){
          v.render=(ext, record, index)=>{
             return <span className="Dropdown_Menu_box">
               <span>查看</span> 
               <Dropdown overlay={
                   <Menu className="Dropdown_Menu_child">
                      <Menu.Item>
                        <span>删除</span>
                      </Menu.Item>
                      <Menu.Item>
                        <span>提交</span>
                      </Menu.Item>
                      <Menu.Item>
                    </Menu.Item>
                 </Menu>
               }>
                 <span className="ant-dropdown-link">
                    更多操作 <Icon type="down" />
                 </span>
               </Dropdown>
             </span>
          }
       }
       return v
    })
    this.setState({columns})
  }

  render() {
    const { dataSource,columns} =this.state;
    const childTable=(record)=>{
      return <FetchTable 
               columns={indexTableColumns_ChildConfig}  
               dataSource={record.childData} 
               rowKey='id' 
               pagination={false}/>
    }
    return (
      <div className="Warehousing">
          <Sider history={this.props.history} />
          <SelestForm onSubmit={this.onSubmit.bind(this,'add')}/>
          <FetchTable  
            columns={columns}
            rowKey='id'
            expandedRowRender={childTable}
            dataSource={dataSource}/>
      </div>
    );
  }
}


