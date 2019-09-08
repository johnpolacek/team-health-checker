/** @jsx jsx */
import { jsx } from 'theme-ui'
import PropTypes from 'prop-types'
import Heading from './Heading'


const HealthCheckBegin = (props) => {

  return (
    <>
      <Heading>Begin Team Health Check</Heading>
      <p sx={{py:3}}>Health checks help you find out how your team is doing, and work together to improve.</p>
      <p sx={{pb:3}}>This health check is based on <a target="_blank" href="https://labs.spotify.com/2014/09/16/squad-health-check-model/">Spotify’s Squad Health Check Model</a>.</p>
      <button sx={{bg:'green'}} onClick={props.onBegin}>Begin Health Check</button>
    </>
  )
}

HealthCheckBegin.propTypes = {
  onBegin: PropTypes.func.isRequired
}

export default HealthCheckBegin