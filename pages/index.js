import App from '../components/App'
import { ApolloConsumer } from 'react-apollo'
import gql from 'graphql-tag'

export default () => (
  <App>
    <h1>Team Health Checker</h1>
    <div>
      <p>Health checks help you find out how your team is doing, and work together to improve.</p>
      <p>This health check is based on <a href="https://labs.spotify.com/2014/09/16/squad-health-check-model/">Spotify’s Squad Health Check Model</a>.</p>
    </div>
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
        }
      }
    `
  }).then(({ data }) => {
    console.log('got data', data);
  })
}
