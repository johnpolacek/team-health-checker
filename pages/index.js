import App from '../components/App'
import HealthCheckCreator from '../components/HealthCheckCreator'
import { Div, H1, P, A, Button } from 'styled-system-html'

import Link from 'next/link'

export default () => (
  <App>
  	<Div textAlign="center" py={4}>
	    <H1 color="base" pt={4} pb={3} fontSize={8} fontWeight="400">Team Health Checker</H1>
	    <Div pt={3} pb={4} fontSize={3}>
		    <P pb={3}>Health checks help you find out how your team is doing, and work together to improve.</P>
		    <P pb={3}>This health check is based on <A color="cyan" href="https://labs.spotify.com/2014/09/16/squad-health-check-model/">Spotify’s Squad Health Check Model</A>.</P>
		  </Div>
      <HealthCheckCreator />
	  </Div>
  </App>
)
