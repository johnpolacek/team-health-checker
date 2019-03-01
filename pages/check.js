import React from 'react'
import App from '../components/App'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const getHealthCheckQuery = gql`query HealthCheck($id: ID!) {
  HealthCheck(id: $id) {
    id
    responses {
      id
      ratings
    }
  }
}`

const HealthCheck = ({ id }) => (
  <App>
      <Query query={getHealthCheckQuery} variables={{id}}>
        {({ loading, error, data }) => {
          if (loading) return <div>Loading...</div>
          if (error || !data.HealthCheck) return <div>Error: Could not load HealthCheck with id: {this.props.id}</div>
          return (
            <h1>Loaded HealthCheck id: {id}</h1>
          )
        }}
      </Query>
    </App>
)
HealthCheck.getInitialProps = async ({ query }) => {
  return { id: query.id }
}
export default HealthCheck