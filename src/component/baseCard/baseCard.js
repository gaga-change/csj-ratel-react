import React from 'react';
import { Row, Col } from 'antd';
import moment from 'moment'
// import { connect } from 'react-redux';
import * as Enum from '@lib/enum';
import './baseCard.scss'

// @connect(
//   state => state.map
// )
export default class BaseCard extends React.Component {
  render() {
    let { columns, dataSource } = this.props;
    columns = columns.map((v, i) => {
      v.key = i + 1;
      return v;
    })
    return (
      <div className="BaseCard">
        <Row gutter={16}>
          {
            columns.map(v => {
              let content = v.dataIndex && dataSource[v.dataIndex];
              if (v.render) {
                content = v.render(content)
              } else if (v.type) {
                switch (v.type) {
                  case 'time': content = moment(Number(content)).format(v.format || 'YYYY-MM-DD'); break;
                  default: break;
                }
              } else if (v.useLocalEnum) {
                content = Enum[v.useLocalEnum].find(eItem => eItem.key === (isNaN(content) ? content : Number(content))) && Enum[v.useLocalEnum].find(eItem => eItem.key === (isNaN(content) ? content : Number(content)))['value']
              } else if (v.useFetchMap) {
                // content=mapSouce[v.useFetchMap].find(eItem=>eItem.key===(isNaN(content)?content:Number(content)))&&mapSouce[v.useFetchMap].find(eItem=>eItem.key===(isNaN(content)?content:Number(content)))['value']
              }

              return <Col className="BaseCard-row" key={v.key} span={v.span || 6} style={{ width: v.width + 'px', marginBottom: v.marginBottom ? v.marginBottom + 'px' : '12px' }}>
                <div className="BaseCard-row-box">
                  <span className="BaseCard-row-title">{v.title}</span> : <span className="BaseCard-row-content">{content}</span>
                </div>
              </Col>
            })
          }
        </Row>
      </div>
    );
  }
}

