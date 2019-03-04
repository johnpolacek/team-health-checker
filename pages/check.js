import React, { useState } from 'react'
import App from '../components/App'
import { getHealthCheckQuery } from '../api/operations'
import { Query } from 'react-apollo'
import HealthCheck from '../components/HealthCheck'
import HealthCheckComplete from '../components/HealthCheckComplete'


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
          return (
            <>
              {{
                READY: <>
                  <h1>Loaded HealthCheck id: {id}</h1>
                  <button onClick={() => setCurrView(views.IN_PROGRESS)}>Begin health check</button>
                </>,
                IN_PROGRESS: <HealthCheck id={id} onComplete={(data) => {
                  console.log('COMPLETE!', data)
                  setCurrView(views.COMPLETE)}} 
                />,
                COMPLETE: <HealthCheckComplete id={id} />
              } [currView] }
            </>
          )
        }}
      </Query>
    </App>
  )
}

Check.getInitialProps = async ({ query }) => {
  return { id: query.id }
}

export default Check
