import React from 'react'
import App from '../components/App'
import HealthCheck from '../components/HealthCheck'
import HealthCheckBegin from '../components/HealthCheckBegin'
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
          return (
            <>
              {{
                READY: <HealthCheckBegin onBegin={() => this.setState({view: this.views.IN_PROGRESS})} />,
                IN_PROGRESS: <HealthCheck id={this.props.id} onComplete={() => { this.setState({view: this.views.COMPLETE}) }} />,
                COMPLETE: <HealthCheckComplete id={this.props.id} />
              }[this.state.view]}
            </>
          )
        }}
      </Query>
    </App>
  }
}