/** @jsx jsx */
import { jsx } from 'theme-ui'
import Head from 'next/head'
import App from '../components/App'
import HealthCheckCreator from '../components/HealthCheckCreator'
import Heading from '../components/Heading'

export default () => (
  <App>
    <Head>
      <title>Team Health Checker</title>
    </Head>
    <div sx={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      px: 4,
      pb: 5,
    }}>
      <Heading>Team Health Checker</Heading>
      <p>Health checks help you find out how your team is doing, and work together&nbsp;to&nbsp;improve.</p>
      <p sx={{pb:4}}>This health check is based on <a sx={{whiteSpace:'nowrap'}} href="https://labs.spotify.com/2014/09/16/squad-health-check-model/">Spotify’s Squad Health Check Model</a>.</p>
      <HealthCheckCreator />
    </div>
  </App>
)