import PropTypes from 'prop-types'
import { Div, Button } from  'styled-system-html'

const HealthCheckBegin = (props) => {

  return (
    <Div>
      <Button onClick={props.onBegin}>Begin Health Check</Button>
    </Div>
  )
}

HealthCheckBegin.propTypes = {
  onBegin: PropTypes.func.isRequired
}

export default HealthCheckBegin

