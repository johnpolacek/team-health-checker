import App from '../components/App'

const HealthCheck = ({ id }) => (
  <App>
    <h1>Loaded HealthCheck id: {id}</h1>
  </App>
)
HealthCheck.getInitialProps = async ({ query }) => {
  return { id: query.id }
}
export default HealthCheck