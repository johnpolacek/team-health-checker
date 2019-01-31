import React from 'react'
import App from '../components/App'
import HealthCheckTopics from '../components/HealthCheckTopics'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const HEALTHCHECK_QUERY = gql`query HealthCheck($id: ID!) {
  HealthCheck(id: $id) {
    id
    responses {
      id
    }
  }
}`

export default class extends React.Component {
  static getInitialProps ({ query: { id } }) {
    return { id }
  }


  render () {
    
    return <App>
      <Query query={HEALTHCHECK_QUERY} variables={{id: this.props.id}}>
        {({ loading, error, data }) => {
          if (loading) return <div>Loading...</div>
          if (error || !data.HealthCheck) return <div>Error: Could not load HealthCheck with id: {this.props.id}</div>
          return (
            <>
              <h1>Loaded HealthCheck id: {this.props.id}</h1>
              <button>Begin health check</button>
              <HealthCheckTopics />
            </>
          )
        }}
      </Query>
    </App>
  }
}