import React from 'react';
import { Menu, Dropdown, Icon,Button,Modal } from 'antd';
import Sider from '../../component/sider/sider'
import FetchTable from '../../component/fetchTable/fetchTable'
import SelestForm from './component/form'
import { indexTableColumns_Config,indexTableColumns_ChildConfig } from './component/config'
import AddForm from './component/addform'
import './warehousing.scss'

export default class Warehousing extends React.Component {
  constructor(props){
    super(props);
    this.state={
      loading:false,
      visible:true,
      pagination: {
      
      },
      dataSource:[{id:1,childData:[{id:3},]},{id:2,childData:[{id:4},]}],
      columns:indexTableColumns_Config
    }
  }

  onSubmit = (type,value)=>{
    console.log(type,value)
    if(type!=='select'){
      this.setState({visible:false})
      this.child.handleRest()
    }
  }

  handleTableChange = (pagination, filters, sorter) => {
    console.log(pagination)
  }

  add = ()=>{
    this.setState({visible:true})
  }

  fetch = ()=>{
    
  }

  componentDidMount(){
    let {columns}=this.state;
    columns=columns.map(v=>{
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
    this.fetch()
  }

  handleCancel = ()=>{
    this.setState({visible:false})
  }

  ref = (res)=>{
    this.child=res
  }

  render() {
    const { dataSource,columns,visible} =this.state;
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
          <SelestForm onSubmit={this.onSubmit.bind(this,'select')}/>
          <div className="alert_Btn">
              <Button type="primary" onClick={this.add}>创建入库业务单</Button>
           </div>
          <FetchTable  
            columns={columns}
            loading={this.state.loading}
            pagination={this.state.pagination}
            onChange={this.handleTableChange}
            rowKey='id'
            expandedRowRender={childTable}
            dataSource={dataSource}/>
            <Modal
              title="创建入库业务单"
              centered={true}
              width={800}
              visible={visible}
              footer={null}
              onCancel={this.handleCancel}>
               <AddForm
                 onRef={this.ref} 
                 onSubmit={this.onSubmit}/>
            </Modal>
      </div>
    );
  }
}


