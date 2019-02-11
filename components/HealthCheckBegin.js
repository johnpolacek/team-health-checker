import PropTypes from 'prop-types'
import { Div, H1, P, A, Button } from  'styled-system-html'

const HealthCheckBegin = (props) => {

  return (
    <Div textAlign="center" py={4}>
      <H1 color="base" pt={4} pb={3} fontSize={6} fontWeight="400">Begin Team Health Check</H1>
      <Div pt={3} pb={4} fontSize={3}>
        <P pb={3}>Health checks help you find out how your team is doing, and work together to improve.</P>
        <P pb={3}>This health check is based on <A target="block" color="cyan" href="https://labs.spotify.com/2014/09/16/squad-health-check-model/">Spotify’s Squad Health Check Model</A>.</P>
      </Div>
      <Button bg="green" color="white" fontSize={4} py={3} px={4} borderRadius="8px" onClick={props.onBegin}>
        Begin Health Check
      </Button>
    </Div>
  )
}

HealthCheckBegin.propTypes = {
  onBegin: PropTypes.func.isRequired
}

export default HealthCheckBegin

