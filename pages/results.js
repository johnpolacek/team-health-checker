import React, { useState } from 'react'
import App from '../components/App'
import { Query } from 'react-apollo'
import HealthCheck from '../components/HealthCheck'
import HealthCheckResults from '../components/HealthCheckResults'
import { getHealthCheckQuery } from '../api/operations'

const Check = ({ id }) => {

  const views = {
    READY: 'READY',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETE: 'COMPLETE'
  }

  const [currView, setCurrView] = useState(views.READY) 

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

Check.getInitialProps = async ({ query }) => {
  return { id: query.id }
}

export default Check
