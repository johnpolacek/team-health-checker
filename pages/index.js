import App from '../components/App'
import { ApolloConsumer } from 'react-apollo'
import gql from 'graphql-tag'

export default () => (
  <App>
    <h1>Team Health Checker</h1>
    <ApolloConsumer>
      {client => (
        <button onClick={() => {onClickCreate(client)}}>Create New Health Check</button>
      )}
    </ApolloConsumer>
  </App>
)

function onClickCreate(client) {
  client.mutate({
    mutation: gql`
      mutation createHealthCheck($responses: [HealthCheckresponsesHealthCheckResponse!]) {
        createHealthCheck(responses: $responses) {
          id
          responses {
            q1
            q2
            q3
            q4
            q5
            q6
            q7
            q8
            q9
            q10
            q11
          }
        }
      }
    `
  }).then(({ data }) => {
    console.log('got data', data);
  })
}
