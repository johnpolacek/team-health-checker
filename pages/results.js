import React from 'react'
import App from '../components/App'
import HealthCheck from '../components/HealthCheck'
import HealthCheckComplete from '../components/HealthCheckComplete'
import { Query } from 'react-apollo'
import { getHealthCheckQuery } from '../api/operations.js'

export default class extends React.Component {

  constructor(props) {
    super(props)

    this.views = {
      READY: 'READY',
      IN_PROGRESS: 'IN_PROGRESS',
      COMPLETE: 'COMPLETE'
    }

    this.state = {
      view: this.views.READY
    }
  }

  static getInitialProps ({ query: { id } }) {
    return { id }
  }

  render () {
    
    return <App>
      <Query query={getHealthCheckQuery} variables={{id: this.props.id}}>
        {({ loading, error, data }) => {
          if (loading) return <div>Loading...</div>
          if (error || !data.HealthCheck) return <div>Error: Could not load HealthCheck with id: {this.props.id}</div>
          <HealthCheckResults id={this.props.id} />
        }}
      </Query>
    </App>
  }
}