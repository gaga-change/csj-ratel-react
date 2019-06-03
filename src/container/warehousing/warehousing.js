import React from 'react';
import { Button, Modal, Spin, Dropdown, Menu, Icon, message, Popover } from 'antd';
import moment from "moment"
import _ from 'lodash';
import { stringify, parse } from 'qs';
import request from '@lib/request'
import FetchTable from '../../component/fetchTable/fetchTable'
import SelestForm from './component/form'
import { planInListColumns} from 'config/table'
import { map_Config, indexTableColumns_ChildConfig, warehousingDetail_Config, BaseCard_Config, PopoverTable_Config } from './component/config'
import AddForm from './component/addform'
import BaseCard from '@component/baseCard/baseCard'
import BaseTitle from '@component/baseTitle/baseTitle'
import './warehousing.scss'

const confirm = Modal.confirm;

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
    } else if (['saveSubmit', 'addSubmit'].includes(type)) {
      value.isCommitFlag = type === 'addSubmit' ? true : false;
      value.planInTime = moment(value.planInTime).valueOf();
      if (ModalTitle === '修改入库业务单') {
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
      console.log(type, value)
      request({
        url: `/webApi/in/bill/saveInBill`,
        method: 'post',
        data: value,
      }).then(res => {
        message.success('操作成功')
        this.setState({ visible: false })
        this.fetch()
        if (this.child) {
          this.child.handleRest()
        }
        console.log(res)
      }).catch(err => {
        console.log(err)
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
        url: '/webApi/in/bill/getInBusiBillDetail',
        method: 'get',
        data: {
          planCode: record.planCode
        }
      }).then(res => {
        this.setState({ visible: true, record: res, ModalTitle: '修改入库业务单' })
      }).catch(err => {
        console.log(err)
      })
    } else {
      this.setState({ visible: true, record: {}, ModalTitle: '创建入库业务单' })
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
    delete data.createTime;
    request({
      url: '/webApi/in/bill/getInBusiBill',
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
      url: '/webApi/in/bill/getInBusiBillDetail',
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
        });
      }
      this.setState({ BaseCard_dataSource, warehousingDetail_dataSource, spinning: false })
    }).catch(err => {
      console.log(err)
      this.setState({ spinning: false })
    })
  }

  handleCancel = () => {
    console.log('这是取消创建入库单的调用')
    this.setState({ visible: false, detailVisible: false })
  }

  ref = (res) => {
    this.child = res
  }

  componentDidMount() {
    this.fetch()
  }

  onOperation = (type, record) => {
    let that = this;
    let api = '/webApi/in/bill/deleteBusiBill';
    let tip = `确定要删除单据 ${record.planCode} 吗？`
    if (type === 'submit') {
      api = '/webApi/in/bill/commitInBill';
      tip = `确定要提交单据 ${record.planCode} 吗？`
    }
    confirm({
      title: tip,
      onOk() {
        request({
          url: api,
          method: 'get',
          data: {
            planCode: record.planCode
          }
        }).then(res => {
          message.success('操作成功')
          that.fetch()
        }).catch(err => {
          console.log(err)
        })
      },
    });
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
      url: '/webApi/in/bill/getInOrder',
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
      console.log(err)
    })
  }

  render() {
    const { PopoverTable_loading, PopoverTable_dataSource, dataSource, spinning, record, visible, ModalTitle, detailVisible, warehousingDetail_dataSource, BaseCard_dataSource } = this.state;

    const columns = _.cloneDeep(planInListColumns).map(v => {
      if (v.render === '') {
        v.render = (ext, record, index) => {
          return <span className="Dropdown_Menu_box">
            <span onClick={this.showDetail.bind(this, record)}>查看</span>
            {
              [0, 2].includes(Number(record.issuedState)) &&
              <Dropdown overlay={
                <Menu className="Dropdown_Menu_child" >
                  {
                    [0, 2].includes(Number(record.issuedState)) &&
                    <Menu.Item onClick={this.add.bind(this, 'update', record)}>
                      <span>修改</span>
                    </Menu.Item>
                  }

                  {
                    [0, 2].includes(Number(record.issuedState)) &&
                    <Menu.Item onClick={this.onOperation.bind(this, 'delete', record)}>
                      <span>删除</span>
                    </Menu.Item>
                  }

                  {
                    [0].includes(Number(record.planState)) &&
                    <Menu.Item onClick={this.onOperation.bind(this, 'submit', record)}>
                      <span>提交</span>
                    </Menu.Item>
                  }
                </Menu>}>
                <span>更多操作<Icon type="down" /></span>
              </Dropdown>
            }
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
        dataSource={record.planDetails} />
    }


    return (
      <div className="Warehousing">
        <SelestForm
          onSubmit={this.onSubmit.bind(this, 'select')}
          selectWordsArr={['商品名称', '状态', '创建日期', '查询重置', '业务单号']} />
        <div className="alert_Btn">
          <Button type="primary" onClick={this.add}>创建入库业务单</Button>
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


