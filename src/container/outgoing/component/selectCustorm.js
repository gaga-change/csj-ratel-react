import React from 'react'
import { Modal, message } from 'antd'
import BaseList from '@component/BaseList'
import { customerList } from 'api'

const tableConfig = [
  { label: '客户编码', prop: 'customerCode' },
  { label: '客户名称', prop: 'customerName' }
]
const searchConfig = [
  { label: '客户编码', prop: 'customerCode' },
  { label: '客户名称', prop: 'customerName' }
]

class SelectCustorm extends React.Component {
  state = {
    visible: false,
    selectedRowKeys: [],
    goodsInStorage_dataSource: [],
    selectionTableLoding: false,
    selectedRow: null,
    showText: ''
  }

  componentDidMount() {
    const { value } = this.props
    this.setState({
      showText: value
    })
  }

  /** 选择按钮 点击事件 */
  showSelect = () => {
    this.setState({ visible: true })
  }

  /** 取消 */
  handleCancel = () => {
    this.setState({ visible: false, selectedRow: null })
  }

  /** 确定 */
  handleOk = () => {
    let { selectedRow } = this.state
    if (!selectedRow) {
      return message.error('请选择客户！')
    }

    this.props.onChange(selectedRow.customerCode, selectedRow)
    this.setState({
      showText: selectedRow.customerName,
      visible: false,
      selectedRow: null
    })
  }

  /** 单选 切换事件 */
  handleTableSelect = (keys, items) => {
    this.setState({
      selectedRow: items[0]
    })
  }

  render() {
    const { visible, showText } = this.state
    return (
      <div>
        <button className="btn-link text-ellipsis" style={{ width: 180 }} type="button" onClick={this.showSelect} title={showText || '请选择客户'}>
          {showText || '请选择客户'}
        </button>
        <Modal
          title="选择客户"
          centered={true}
          destroyOnClose={true}
          width={1000}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}>
          <div className="selectCommodityModal">
            <BaseList vertical={false} searchConfig={searchConfig} api={customerList} tableConfig={tableConfig} rowKey="id"
              rowSelection={{
                type: 'radio',
                onChange: this.handleTableSelect
              }}
            />
          </div>
        </Modal>
      </div>
    )
  }
}

export default SelectCustorm