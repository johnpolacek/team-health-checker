import { Div, P, A } from 'styled-system-html'

export default () => (
	<Div px={3} pt={3} pb={4} fontSize={[2,2,3]}>
    <P pb={3}>Health checks help you find out how&nbsp;your team is doing, and&nbsp;work&nbsp;together&nbsp;to&nbsp;improve.</P>
    <P pb={3}>This health check is based on <A color="cyan" href="https://labs.spotify.com/2014/09/16/squad-health-check-model/" style={{whiteSpace:'nowrap'}}>Spotify’s Squad Health Check Model</A>.</P>
  </Div>
)