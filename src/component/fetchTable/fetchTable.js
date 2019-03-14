import React from 'react';
import moment from 'moment'
import { Table } from 'antd';
import { connect } from 'react-redux';
import * as Enum from '@lib/enum';
import './fetchTable.scss'

@connect(
  state => state.map
)

export default class FetchTable extends React.Component {
  
  render() {
    let { dataSource=[],useIndex=false,columns=[],pagination,size='small',locale={emptyText:'暂无数据' }, bordered=true,...rest } = this.props;
    const { mapSouce } =this.props;
    if(pagination){
      pagination={...pagination, showTotal:total => `共 ${total} 条`}
    }
    columns=columns.map((v,i)=>{
      v.key=i+1;
      if(v.type){ 
        switch(v.type){
          case 'time':v.render=(item)=>moment(Number(item)).format(v.format||'YYYY-MM-DD HH:mm:ss');break;
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

    return (
      <div className="FetchTable">
          <Table  
             {...rest}
             pagination={pagination}
             dataSource={dataSource}
             columns={columns}
             bordered={bordered}
             locale={locale}
             size={size}/>
      </div>
    );
  }
}

