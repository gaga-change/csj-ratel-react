import React from 'react';
import moment from 'moment'
import { Table, Tooltip } from 'antd';
// import { connect } from 'react-redux';
import * as Enum from '@lib/enum';
import './fetchTable.scss'

// @connect(
//   state => state.map
// )

export default class FetchTable extends React.Component {

  render() {
    let { dataSource = [], useIndex = false, columns = [], pagination, size = 'small', locale = { emptyText: '暂无数据' }, bordered = true, ...rest } = this.props;
    // const { mapSouce } =this.props;
    if (pagination) {
      pagination = { ...pagination, showTotal: total => `共 ${total} 条` }
    }
    columns = columns.map((v, i) => {
      v.key = i + 1;
      if (v.type) {
        switch (v.type) {
          case 'time': v.render = (item) => moment(Number(item)).format(v.format || 'YYYY-MM-DD HH:mm:ss'); break;
          case 'content': v.render = (text, record)=>{
            let showtext=record[v.dataIndex] && record[v.dataIndex].length>10?record[v.dataIndex].substring(0,10)+'...':record[v.dataIndex]
            let tiptext=record[v.dataIndex]? record[v.dataIndex]:''
            if(tiptext && tiptext.length>10){
              return <Tooltip  title={ tiptext }>
                  <span>{ showtext }</span>
                </Tooltip>
            }else{
              return <span>{ tiptext }</span>
            }
          }; break;
          default: break;
        }
      } else if (v.useLocalEnum) {
        v.render = (item) => Enum[v.useLocalEnum].find(eItem => eItem.key === (isNaN(item) ? item : Number(item))) && Enum[v.useLocalEnum].find(eItem => eItem.key === (isNaN(item) ? item : Number(item)))['value']
      } else if (v.useFetchMap) {
        // v.render=(item)=>mapSouce[v.useFetchMap].find(eItem=>eItem.key===(isNaN(item)?item:Number(item)))&&mapSouce[v.useFetchMap].find(eItem=>eItem.key===(isNaN(item)?item:Number(item)))['value']
      } else if(v.filepath){
        v.render= (text, record)=>{
          return ( <div>
              {
                record.filePathList.map((item, index) => {
                  return <div key={index}><a href={item.filePath} target="_blank" rel="noopener noreferrer" >{item.fileName}</a></div>
                })
              }
          </div> )
        }
      }
      return v;
    })

    if (Array.isArray(dataSource)) {
      dataSource = dataSource.map((v, i) => {
        if (!this.props.rowKey) {
          v.key = i + 1;
        }
        if (useIndex) {
          v.index = i + 1;
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
          size={size} />
      </div>
    );
  }
}

