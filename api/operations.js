import gql from 'graphql-tag';

export const topicTitles = ['Delivering Value','Easy to release','Fun','Health of Codebase','Learning','Mission','Pawns or Players','Speed','Suitable Process','Support','Teamwork']
export const ratingLabels = {0: 'Sucky', 1: 'OK', 2: 'Awesome'}

export const getHealthCheckQuery = gql`query HealthCheck($id: ID!) {
  HealthCheck(id: $id) {
    id
    responses {
      id
      ratings
    }
  }
}`

export const createHealthCheckMutation = gql`
  mutation createHealthCheck($responses: [HealthCheckresponsesHealthCheckResponse!]) {
    createHealthCheck(responses: $responses) {
      id
    }
  }
`

export const createHealthCheckResponseMutation = gql`
  mutation createHealthCheckResponse($ratings: [Int!]!, $healthCheckId: ID!) {
    createHealthCheckResponse(ratings: $ratings, healthCheckId: $healthCheckId) {
      id
    }
  }
`