import App from '../components/App'
import HealthCheckCreator from '../components/HealthCheckCreator'
import HealthCheckIntro from '../components/HealthCheckIntro'
import { Div, H1 } from 'styled-system-html'

import Link from 'next/link'

export default () => (
  <App>
  	<Div textAlign="center" px={4} py={[0,0,4]}>
	    <H1 color="base" pt={4} pb={3} fontSize={[5,6,7,8]}>Team Health Checker</H1>
	    <HealthCheckIntro />
      	<HealthCheckCreator />
	  </Div>
  </App>
)
