import React from 'react'
import { parse } from 'qs';
import { connect } from 'react-redux'

class ReportList extends React.Component {

  state = {
    ownerCode: ''
  }

  componentDidMount() {
    const { user } = this.props
    const { ownerCode } = user || {}

    this.setState({
      ownerCode: (Math.random() + '').substr(-3) + ownerCode + (Math.random() + '').substr(-3)
    })
  }

  render() {
    const { location } = this.props
    const { ownerCode } = this.state
    let { u } = parse(location.search.slice(1))
    return (<div style={{ width: '100%', height: '100%' }}>
      {/* {location.search} */}
      {
        ownerCode && <iframe title="报表"
          src={`http://bi.csjmro.com/WebReport/ReportServer?reportlet=${u}&owner_code=${ownerCode}`}
          style={{ width: '100%', height: '100%', 'backgroundColor': 'rgb(255, 255, 255)', border: 'none' }}
        >
        </iframe>
      }
    </div>)
  }
}

const mapStateToProps = (state) => ({
  user: state.user
})

export default connect(mapStateToProps)(ReportList)