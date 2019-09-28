import Head from 'next/head'
import App from '../components/App'
import HealthCheckCreator from '../components/HealthCheckCreator'
import PageContainer from '../components/PageContainer'
import Heading from '../components/Heading'

export default () => (
  <App>
    <Head>
      <title>Team Health Checker</title>
      <meta name="description" content="Health checks help you find out how your team is doing, and work together to improve" />
    </Head>
    <PageContainer>
      <Heading>Team Health Checker</Heading>
      <HealthCheckCreator />
    </PageContainer>
  </App>
)