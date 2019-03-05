import React, { useState } from 'react'
import App from '../components/App'
import HealthCheckResults from '../components/HealthCheckResults'
import { Query } from 'react-apollo'
import { getHealthCheckQuery } from '../api/operations'

const Results = ({ id }) => {

  return (
    <App>
      <Query query={getHealthCheckQuery} variables={{id}}>
        {({ loading, error, data }) => {
          if (loading) return <div>Loading...</div>
          if (error || !data.HealthCheck) return <div>Error: Could not load HealthCheck with id: {id}</div>
          return <HealthCheckResults id={id} />
        }}
      </Query>
    </App>
  )
}

Results.getInitialProps = async ({ query }) => {
  return { id: query.id }
}

export default Results
