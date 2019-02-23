import React from 'react'
import App from '../components/App'
import HealthCheckResults from '../components/HealthCheckResults'
import { Query } from 'react-apollo'
import { getHealthCheckQuery } from '../api/operations.js'

export default class extends React.Component {
  
  constructor(props) {
    super(props)
  }

  static getInitialProps ({ query: { id } }) {
    return { id }
  }

  render () {
    return <App>
      <Query query={getHealthCheckQuery} variables={{id: this.props.id}}>
        {({ loading, error, data }) => {
          if (loading) {
            return <div>Loading...</div>
          } else if (error || !data.HealthCheck) {
            return <div>Error: Could not load HealthCheck with id: {this.props.id}</div>
          } else {
            return <HealthCheckResults id={this.props.id} />
          }
        }}
      </Query>
    </App>
  }
}