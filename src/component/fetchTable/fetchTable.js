import React from 'react';
import moment from 'moment'
import { Table } from 'antd';
import * as Enum from '@lib/enum';
import './fetchTable.scss'
export default class FetchTable extends React.Component {
  
  render() {
    let { dataSource=[],useIndex=false,columns=[],size='small',locale={emptyText:'暂无数据' }, bordered=true,...rest } = this.props;
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

    return (
      <div className="FetchTable">
          <Table  
             {...rest}
             dataSource={dataSource}
             columns={columns}
             bordered={bordered}
             locale={locale}
             size={size}/>
      </div>
    );
  }
}

