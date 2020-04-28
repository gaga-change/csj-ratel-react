import React from 'react';
import { Table } from 'antd';
// import { connect } from 'react-redux';
import moment from 'moment'
import * as Enum from '@lib/enum';
import './selectionTable.scss'
// @connect(
//   state => state.map
// )
export default class SelectionTable extends React.Component {

  onSelectChange = (type, selectedRowKeys) => {
    const { onSelectChange, dataSource } = this.props;
    if (!onSelectChange) {
      return
    } else if (type === 'chage') {
      onSelectChange(selectedRowKeys)
    } else if (type === 'all-data') {
      if (!this.props.rowKey) {
        onSelectChange(dataSource.map(v => v.key))
      } else {
        onSelectChange(dataSource.map(v => v[this.props.rowKey]))
      }
    }
  }

  render() {

    let { dataSource = [], columns = [], useIndex = false, pagination, selectedRowKeys = [], size = 'small', locale = { emptyText: '暂无数据' }, bordered = true, ...rest } = this.props;
    // const { mapSouce } = this.props;
    if (pagination) {
      pagination = { ...pagination, showTotal: total => `共 ${total} 条` }
    }
    columns = columns.map((v, i) => {
      v.key = i + 1;
      if (v.type) {
        switch (v.type) {
          case 'time': v.render = (item) => moment(Number(item)).format(v.format || 'YYYY-MM-DD HH:mm:ss'); break;
          default: break;
        }
      } else if (v.useLocalEnum) {
        v.render = (item) => Enum[v.useLocalEnum].find(eItem => eItem.key === (isNaN(item) ? item : Number(item))) && Enum[v.useLocalEnum].find(eItem => eItem.key === (isNaN(item) ? item : Number(item)))['value']
      } else if (v.useFetchMap) {
        // v.render=(item)=>mapSouce[v.useFetchMap].find(eItem=>eItem.key===(isNaN(item)?item:Number(item)))&&mapSouce[v.useFetchMap].find(eItem=>eItem.key===(isNaN(item)?item:Number(item)))['value']
      }else if(v.filepath){
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

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange.bind(this, 'chage'),
      hideDefaultSelections: true,
      selections: [{
        key: 'all-data',
        text: '选择当前所有数据',
        onSelect: this.onSelectChange.bind(this, 'all-data')
      }],
      onSelection: this.onSelection,
    };

    return (
      <div className="SelectionTable">
        <Table
          {...rest}
          pagination={pagination}
          rowSelection={rowSelection}
          dataSource={dataSource}
          columns={columns}
          bordered={bordered}
          locale={locale}
          size={size} />
      </div>
    );
  }
}

