import gql from 'graphql-tag';

export const getHealthCheckQuery = gql`
  query HealthCheck($id: ID!) {
    HealthCheck(id: $id) {
      id
      responses {
        id
        ratings
      }
    }
  }
`

export const createHealthCheckMutation = gql`
  mutation createHealthCheck($responses: [HealthCheckresponsesHealthCheckResponse!]) {
    createHealthCheck(responses: $responses) {
      id
    }
  }
`