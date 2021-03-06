import React from 'react';
import { Button, Modal, Spin, message, Popover, Popconfirm } from 'antd';
import moment from "moment"
import _ from 'lodash';
import { stringify, parse } from 'qs';
import FetchTable from '../../component/fetchTable/fetchTable'
import SelestForm from './component/form'
import { planInListColumns } from 'config/table'
import { map_Config, indexTableColumns_ChildConfig, warehousingDetail_Config, BaseCard_Config, PopoverTable_Config } from './component/config'
import AddForm from './component/addform'
import BaseCard from '@component/baseCard/baseCard'
import BaseTitle from '@component/baseTitle/baseTitle'
import { saveInBill, deleteBusiBill, getInBusiBillDetail, getInBusiBill, getInOrder } from 'api'

import './warehousing.scss'

export default class Warehousing extends React.Component {
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
      warehousingDetail_dataSource: [{}, {}],
      BaseCard_dataSource: {},
      record: {},
      PopoverTable_dataSource: [],
      PopoverTable_loading: false,
      activePopover_row: {}
    }
  }

  onSubmit = (type, value) => {
    let { ModalTitle, record, pagination } = this.state;
    if (type === "select") {
      if (Array.isArray(value.createTime)) {
        value.createTimeFrom = moment(value.createTime[0]).valueOf()
        value.createTimeTo = moment(value.createTime[1]).valueOf()
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
    } else if (type === 'addSubmit' || type === 'saveSubmit') {
      value.isCommitFlag = type === 'addSubmit' ? true : false;
      value.isUpdateFlag = false
      value.planInTime = moment(value.planInTime).valueOf();
      if (ModalTitle === '修改入库业务单') {
        value.isUpdateFlag = true
        value.billNo = record.billNo
      }
      if (Array.isArray(value.items)) {
        value.items = _.cloneDeep(value.items).map(v => {
          for (let i in map_Config) {
            v[i] = v[map_Config[i]]
          }
          return v
        })
      }
      return saveInBill(value).then(res => {
        if (!res) return
        message.success('操作成功')
        this.setState({ visible: false })
        this.fetch()
        if (this.child) {
          this.child.handleRest()
        }
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
      getInBusiBillDetail({
        billNo: record.billNo
      }).then(res => {
        if (!res) return
        this.setState({ visible: true, record: res.data, ModalTitle: '修改入库业务单' })
      })
    } else {
      this.setState({ visible: true, record: {}, ModalTitle: '创建入库业务单' })
    }
  }

  fetch = (json) => {
    this.setState({ loading: true })
    let { search, pathname } = this.props.history.location
    let { current, pageSize, ...rest } = parse(search.slice(1))
    let { pagination } = this.state;
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
    delete data.createTime;
    getInBusiBill(data).then(res => {
      this.setState({
        loading: false,
      })
      if (!res) return
      pagination.total = res.data.total
      this.setState({
        dataSource: res.data.list || [],
        pagination
      })
    })
  }

  showDetail = (record) => {
    let { warehousingDetail_dataSource, BaseCard_dataSource } = this.state;
    this.setState({ detailVisible: true, spinning: true })
    getInBusiBillDetail({ billNo: record.billNo }).then(res => {
      this.setState({ spinning: false })
      if (!res) return
      res = res.data
      BaseCard_dataSource = res;
      if (Array.isArray(res.items)) {
        warehousingDetail_dataSource = res.items.map(v => {
          v.billNo = res.billNo;
          return v;
        });
      }
      this.setState({ BaseCard_dataSource, warehousingDetail_dataSource })
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

  handleDelete = (record) => {
    deleteBusiBill(record.billNo).then(res => {
      if (!res) return
      message.success('操作成功')
      this.fetch()
    })
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
    getInOrder(row).then(res => {
      this.setState({ PopoverTable_loading: false })
      if (!res) return
      this.setState({
        activePopover_row: row,
        PopoverTable_dataSource: res.data,
      })
    })
  }

  render() {
    const { PopoverTable_loading, PopoverTable_dataSource, dataSource, spinning, record, visible, ModalTitle, detailVisible, warehousingDetail_dataSource, BaseCard_dataSource } = this.state;

    const columns = _.cloneDeep(planInListColumns).map(v => {
      if (v.render === '') {
        v.render = (ext, record, index) => {
          return <span className="Dropdown_Menu_box">
            <span data-rule-id="warehousing-show" onClick={this.showDetail.bind(this, record)}>查看</span>
            {(record.billStatus === 0 || record.billStatus === 2) && <span data-rule-id="warehousing-modify" onClick={this.add.bind(this, 'update', record)}>修改</span>}
            {(record.billStatus === 0 || record.billStatus === 2 || record.billStatus === 3) && <Popconfirm title="是否确认删除？" okText="是" cancelText="否" onConfirm={this.handleDelete.bind(this, record)}>
              <span data-rule-id="warehousing-del">删除</span>
            </Popconfirm>}
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
        pagination={false}
        columns={indexTableColumns_ChildConfig}
        dataSource={record.items} />
    }


    return (
      <div className="Warehousing">
        <SelestForm
          onSubmit={this.onSubmit.bind(this, 'select')}
          selectWordsArr={['商品名称', '状态', '创建日期', '查询重置', '订单号']} />
        <div className="alert_Btn">
          <Button data-rule-id="warehousing-create" type="primary" onClick={this.add}>创建入库业务单</Button>
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
          title="入库业务单详情"
          className="warehousing_detail_modal"
          visible={detailVisible}
          destroyOnClose={true}
          width={1000}
          footer={false}
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


