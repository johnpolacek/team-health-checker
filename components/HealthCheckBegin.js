import PropTypes from 'prop-types'
import { Div, H1, P, A } from  'styled-system-html'
import Button from './Button'
import HealthCheckIntro from './HealthCheckIntro'

const HealthCheckBegin = (props) => {

  return (
    <Div textAlign="center" py={[3,4]} px={3}>
      <H1 color="base" pt={4} pb={3} fontSize={[5,6]}>Begin Team Health&nbsp;Check</H1>
      <HealthCheckIntro />
      <Button bg="green" onClick={props.onBegin}>Begin Health Check</Button>
    </Div>
  )
}

HealthCheckBegin.propTypes = {
  onBegin: PropTypes.func.isRequired
}

export default HealthCheckBegin
