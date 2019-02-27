import React from 'react';
import { Table } from 'antd';
import './selectionTable.scss'
export default class SelectionTable extends React.Component {
  
  onSelectChange = (type,selectedRowKeys) => {
    const { onSelectChange,dataSource } =this.props;
    if(!onSelectChange){
      return 
    } else if(type==='chage'){
      onSelectChange(selectedRowKeys)
    } else if(type==='all-data'){
      if(!this.props.rowKey){
        onSelectChange(dataSource.map(v=>v.key))
      } else{
        onSelectChange(dataSource.map(v=>v[this.props.rowKey]))
      }
    }
  }

  render() {

    let { dataSource=[], columns=[],useIndex=false,selectedRowKeys=[],size='small',locale={emptyText:'暂无数据' }, bordered=true,...rest } = this.props;
    
    columns=columns.map((v,i)=>{
      v.key=i+1;
      return v;
    })

    
    if(!this.props.rowKey&&Array.isArray(dataSource)){
      dataSource=dataSource.map((v,i)=>{
        v.key=i+1;
        if(useIndex){
          v.index=i+1;
        }
        return v;
      }) 
    }

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange.bind(this,'chage'),
      hideDefaultSelections: true,
      selections: [{
        key: 'all-data',
        text: '选择当前所有数据',
        onSelect: this.onSelectChange.bind(this,'all-data')
      }],
      onSelection: this.onSelection,
    };

    return (
      <div className="SelectionTable">
          <Table  
             {...rest}
             rowSelection={rowSelection}
             dataSource={dataSource}
             columns={columns}
             bordered={bordered}
             locale={locale}
             size={size}/>
      </div>
    );
  }
}

