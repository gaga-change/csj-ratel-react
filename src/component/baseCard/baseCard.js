import React from 'react';
import { Row, Col } from 'antd';
import './baseCard.scss'
export default class BaseCard extends React.Component {
  render() {
    let { columns ,dataSource } = this.props;
    columns=columns.map((v,i)=>{
      v.key=i+1;
      return v;
    })
    return (
      <div className="BaseCard">
           <Row gutter={16}>
              {
                columns.map(v=>{
                  let content=(v.dataIndex&&dataSource[v.dataIndex])||'';
                  if(v.render){
                    content=v.render(content)
                  }

                  return  <Col className="BaseCard-row" key={v.key} span={v.span||6} style={{width:v.width+'px',marginBottom:v.marginBottom?v.marginBottom+'px':'12px'}}>
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

