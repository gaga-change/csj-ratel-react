import React from 'react';
import { Button, Modal, Spin, message, Popover, Popconfirm } from 'antd';
import _ from 'lodash';
import moment from "moment"
import { stringify, parse } from 'qs';
import request from '@lib/request'
import FetchTable from '../../component/fetchTable/fetchTable'
import SelestForm from './component/form'
import { planOutListColumns } from 'config/table'
import { indexTableColumns_ChildConfig, map_Config, warehousingDetail_Config, BaseCard_Config, PopoverTable_Config } from './component/config'
import AddForm from './component/addform'
import BaseCard from '@component/baseCard/baseCard'
import BaseTitle from '@component/baseTitle/baseTitle'
import { saveOutBill, outBillDel } from 'api'
import './outgoing.scss'
export default class Outgoing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      visible: false,
      detailVisible: false,
      spinning: false,
      pagination: {

      },
      dataSource: [],
      warehousingDetail_dataSource: [],
      BaseCard_dataSource: {},
      record: {},
      ModalTitle: '创建出库业务单',

      PopoverTable_dataSource: [],
      PopoverTable_loading: false,
      activePopover_row: {}
    }
  }

  onSubmit = (type, value) => {
    let { ModalTitle, record, pagination } = this.state;
    if (type === "select") {
      if (Array.isArray(value.createTime)) {
        value.createBeginDate = moment(value.createTime[0]).valueOf()
        value.createEndDate = moment(value.createTime[1]).valueOf()
      }
      if (!Object.keys(value).length) {
        pagination = {
          current: 1,
          pageSize: 10
        }
      }
      this.setState({ pagination }, () => {
        this.fetch(value)
      })
    } else if (type === "submit") {
      value.planOutTime = moment(value.planOutTime).valueOf();
      value.isCommitFlag = type === 'submit' ? true : false;
      if (ModalTitle === '修改出库业务单') {
        value.planCode = record.planCode
      }
      if (Array.isArray(value.items)) {
        value.items = _.cloneDeep(value.items).map(v => {
          for (let i in map_Config) {
            v[i] = v[map_Config[i]]
          }
          return v
        })
      }
      return saveOutBill(value).then(res => {
        if (!res) return
        message.success('操作成功')
        this.setState({ visible: false })
        if (this.child) {
          this.child.handleRest()
        }
        this.fetch()
      })
    }
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.setState({
      pagination
    }, () => {
      this.fetch()
    })
  }

  add = (type, record) => {
    if (type === 'update') {
      request({
        url: '/webApi/out/bill/getOutBusiBillDetail',
        method: 'get',
        data: {
          planCode: record.planCode
        }
      }).then(res => {
        this.setState({ visible: true, record: res, ModalTitle: '修改出库业务单' })
      }).catch(err => {
      })
    } else {
      this.setState({ visible: true, record: {}, ModalTitle: '创建出库业务单' })
    }
  }


  fetch = (json) => {
    this.setState({ loading: true })
    let { search, pathname } = this.props.history.location
    let { current, pageSize, ...rest } = parse(search.slice(1))
    let { dataSource, pagination } = this.state;
    if (!Object.keys(pagination).length) {
      pagination = {
        current: Number(current) || 1,
        pageSize: Number(pageSize) || 10
      }
      this.setState({ pagination })
    }
    let data = {};
    if (json) {
      data = { ...pagination, ...json };
    } else {
      data = { ...pagination, ...rest };
    }

    delete data.total;
    delete data.createTime;
    this.props.history.replace(`${pathname}?${stringify(data)}`)
    data.pageNum = data.current;
    delete data.current;

    request({
      url: '/webApi/out/bill/getOutBusiBill',
      method: 'post',
      data: data
    }).then(res => {
      if (res.list && Array.isArray(res.list)) {
        dataSource = res.list
        pagination.total = res.total
      }
      this.setState({
        dataSource,
        pagination,
        loading: false,
      })
    }).catch(err => {
      this.setState({
        loading: false,
      })
    })
  }

  showDetail = (record) => {
    let { warehousingDetail_dataSource, BaseCard_dataSource } = this.state;
    this.setState({ detailVisible: true, spinning: true })
    request({
      url: '/webApi/out/bill/getOutBusiBillDetail',
      method: 'get',
      data: {
        planCode: record.planCode
      }
    }).then(res => {
      BaseCard_dataSource = res;
      if (Array.isArray(res.planDetails)) {
        warehousingDetail_dataSource = res.planDetails.map(v => {
          v.planCode = res.planCode;
          return v;
        });;
      }
      this.setState({ BaseCard_dataSource, warehousingDetail_dataSource, spinning: false })
    }).catch(err => {
      this.setState({ spinning: false })
    })
  }

  handleCancel = () => {
    this.setState({ visible: false, detailVisible: false })
  }

  ref = (res) => {
    this.child = res
  }

  componentDidMount() {
    this.fetch()
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return
    }
  }

  onMouseEnter(row) {
    let { activePopover_row } = this.state;
    if (activePopover_row.id === row.id) {
      return
    }
    this.setState({ PopoverTable_loading: true })
    request({
      url: '/webApi/out/bill/getOutOrder',
      method: 'post',
      data: row
    }).then(res => {
      this.setState({
        activePopover_row: row,
        PopoverTable_dataSource: res,
        PopoverTable_loading: false
      })
    }).catch(err => {
      this.setState({
        PopoverTable_loading: false
      })
    })
  }

  /** 删除出库业务单 */
  handleDelete = (record) => {
    outBillDel(record.billNo).then(res => {
      if (!res) return
      message.success('操作成功！')
      this.fetch()
    })
  }

  render() {
    const { PopoverTable_loading, PopoverTable_dataSource, dataSource, ModalTitle, spinning, record, visible, detailVisible, warehousingDetail_dataSource, BaseCard_dataSource } = this.state;
    const columns = _.cloneDeep(planOutListColumns).map(v => {
      if (v.render === '') {
        v.render = (ext, record, index) => {
          return <span className="Dropdown_Menu_box">
            <span onClick={this.showDetail.bind(this, record)}>查看</span>
            <Popconfirm title="确定要删除吗?" onConfirm={this.handleDelete.bind(this, record)}>
              <span> 删除</span>
            </Popconfirm>
          </span>
        }
      }
      return v
    })

    const PopoverTable = <div className="PopoverTable" style={{ minWidth: 300 }}>
      <FetchTable
        useIndex={true}
        loading={PopoverTable_loading}
        pagination={false}
        columns={PopoverTable_Config}
        dataSource={PopoverTable_dataSource} />
    </div>

    const alert_columns = _.cloneDeep(warehousingDetail_Config).map(v => {
      if (v.render === '') {
        v.render = (ext, record, index) => {
          return Number(ext) ? <Popover placement="topLeft" title="入库订单信息" trigger="hover" content={PopoverTable} >
            <div onMouseEnter={this.onMouseEnter.bind(this, record)} style={{ cursor: 'pointer' }}>{ext}</div>
          </Popover> : ext
        }
      }
      return v
    })

    const childTable = (record) => {
      return <FetchTable
        columns={indexTableColumns_ChildConfig}
        dataSource={record.planDetails}
        pagination={false} />
    }

    return (
      <div className="Outgoing">

        <SelestForm
          onSubmit={this.onSubmit.bind(this, 'select')}
          selectWordsArr={['商品名称', '状态', '创建日期', '纵向查询', '联系人电话', '订单号']} />
        <div className="alert_Btn">
          <Button type="primary" onClick={this.add}>创建出库业务单</Button>
        </div>

        <FetchTable
          columns={columns}
          loading={this.state.loading}
          pagination={this.state.pagination}
          onChange={this.handleTableChange}
          expandedRowRender={childTable}
          dataSource={dataSource} />
        <Modal
          title={ModalTitle}
          centered={true}
          destroyOnClose={true}
          width={1000}
          visible={visible}
          footer={null}
          onCancel={this.handleCancel}>
          <AddForm
            record={record}
            onRef={this.ref}
            onSubmit={this.onSubmit} />
        </Modal>

        <Modal
          title="出库业务单详情"
          className="Outgoing_detail_modal"
          visible={detailVisible}
          width={1000}
          footer={false}
          destroyOnClose={true}
          onCancel={this.handleCancel}>
          <Spin spinning={spinning}>
            <div className="warehousing_detail">
              <BaseTitle title="基本信息" />
              <BaseCard columns={BaseCard_Config} dataSource={BaseCard_dataSource} />
              <BaseTitle title="相关明细" />
              <FetchTable
                pagination={{ pageSize: 10 }}
                useIndex={true}
                columns={alert_columns}
                dataSource={warehousingDetail_dataSource} />
            </div>
          </Spin>
        </Modal>
      </div>
    );
  }
}


