import { useState } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Link from 'next/link'

const CREATEHEALTHCHECK_MUTATION = gql`
  mutation createHealthCheck($responses: [HealthCheckresponsesHealthCheckResponse!]) {
    createHealthCheck(responses: $responses) {
      id
    }
  }
`

const HealthCheckCreator = () => {
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <>
      {
        id ? (
          <>
            <p>You created a new Health Check!</p>
            <Link prefetch href={'/healthcheck/'+id}>
              <a>View health check</a>
            </Link>
          </>
        ) : (
          <Mutation 
            mutation={CREATEHEALTHCHECK_MUTATION} 
            onCompleted={(data) => {setId(data.createHealthCheck.id)}}
          >
            {createMutation => <button 
                onClick={() => {
                  setLoading(true)
                  createMutation()
                }}
                children = {loading ? 'Loading...' : 'Create New Health Check'}
              />
            }
          </Mutation>
        )
      }
    </>
  )
}

export default HealthCheckCreator

