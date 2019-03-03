import Head from 'next/head'
import App from '../components/App'
import HealthCheckCreator from '../components/HealthCheckCreator'
import { Div, H1, P } from 'styled-system-html'

export default () => (
  <App>
    <Head>
      <title>Team Health Checker</title>
    </Head>
    <Div textAlign="center" py={54}>
      <H1 color="base" pt={4} pb={3} fontSize={8} fontWeight="400">Team Health Checker</H1>
      <P pb={5} fontSize={3}>Health checks help you find out how your team is doing, and work together to improve.</P>
      <HealthCheckCreator />
    </Div>
  </App>
)