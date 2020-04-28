import React from 'react'

import BaseSearch from './BaseSearch'
import BaseTable from './BaseTable'

class BaseList extends React.Component {

  componentDidMount() {

  }

  handleSearch = params => {
    if (this.baseTable) {
      this.baseTable.updateSearchParms(params)
    }
  }

  handleRef = ref => this.baseTable = ref

  render() {
    const { searchConfig = [], tableConfig = [], api, rowKey = 'id', vertical = 'false', rowSelection } = this.props
    return (<div>
      <BaseSearch vertical={vertical} config={searchConfig} onSubmit={this.handleSearch} />
      <BaseTable onRef={this.handleRef} rowKey={rowKey} api={api} config={tableConfig} rowSelection={rowSelection} />
    </div>)
  }
}

export default BaseList