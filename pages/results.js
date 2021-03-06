import React from 'react'
import Head from 'next/head'
import App from '../components/App'
import HealthCheckResults from '../components/HealthCheckResults'
import { Query } from 'react-apollo'
import { getHealthCheckQuery } from '../api/operations.js'
import PageContainer from '../components/PageContainer'

const Results = ({ id }) => (
  <App>
    <Query query={getHealthCheckQuery} variables={{id: id}}>
        {({ loading, error, data }) => {
          if (loading) {
            return <div>Loading...</div>
          } else if (error || !data.HealthCheck) {
            return <div>Error: Could not load HealthCheck with id: {id}</div>
          } else {
            return <>
              <Head>
                <title>Team Health Checker | Results</title>
              </Head>
              <PageContainer>
                <HealthCheckResults id={id} />
              </PageContainer>
            </>
          }
        }}
      </Query>
  </App>
)

Results.getInitialProps = async ({ query }) => {
  return { id: query.id }
}

export default Results
