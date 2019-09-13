import Head from 'next/head'
import App from '../components/App'
import HealthCheckCreator from '../components/HealthCheckCreator'
import PageContainer from '../components/PageContainer'
import Heading from '../components/Heading'

export default () => (
  <App>
    <Head>
      <title>Team Health Checker</title>
    </Head>
    <PageContainer>
      <Heading>Team Health Checker</Heading>
      <HealthCheckCreator />
    </PageContainer>
  </App>
)