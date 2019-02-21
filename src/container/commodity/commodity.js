import React from 'react';
import Sider from '../../component/sider/sider'
import FetchTable from '../../component/fetchTable/fetchTable'
import { indexTableColumnsConfig } from './component/config'
import'./commodity.scss'
export default class Commodity extends React.Component {
  state={
    dataSource:[],
    columns:indexTableColumnsConfig,
    pagination: {
      
    },
    loading:false
  }

  componentDidMount(){
    let {columns}=this.state;
    columns.map(v=>{
       if(v.render!==undefined){
          v.render=(ext, record, index)=>{
             return <div className="operationBtn">
               <span>查看</span>
               <span>删除</span>
               <span>调价</span>
             </div>
          }
       }
       return v
    })
    this.setState({columns})
    this.fetch()
  }

  fetch = ()=>{
    
  }

  handleTableChange = (pagination, filters, sorter) => {
    
  }

  render() {
    const { dataSource,columns }=this.state;
    return (
      <div className="Commodity">
          <Sider history={this.props.history} /> 
          <FetchTable 
            dataSource={dataSource} 
            columns={columns}
            loading={this.state.loading}
            pagination={this.state.pagination}
            onChange={this.handleTableChange}/>
      </div>
    );
  }
}

