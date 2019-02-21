import React from 'react';
import { Table } from 'antd';
import './fetchTable.scss'
export default class FetchTable extends React.Component {
  render() {
    const { 
      dataSource=[],
      columns=[],
      size='small',
      rowKey='id',
      locale={
        emptyText:'暂无数据'
      },
      bordered=true,
      ...rest 
    } = this.props;
    return (
      <div className="FetchTable">
          <Table  
             {...rest}
             dataSource={dataSource}
             columns={columns}
             bordered={bordered}
             locale={locale}
             rowKey={rowKey}
             size={size}/>
      </div>
    );
  }
}

