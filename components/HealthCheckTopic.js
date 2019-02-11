import PropTypes from 'prop-types'
import { useState } from 'react'
import Slider from 'react-rangeslider'
import HealthCheckIcon from './HealthCheckIcon'
import { Div, H2, Span, Input, Label, Button } from 'styled-system-html'
import { topicTitles } from '../api/operations'
import { ratingLabels } from './HealthCheck'

const HealthCheckTopic = (props) => {

  const [currRating, setCurrRating] = useState(1)
  const colors = ['orange','purple','cyan','pink']
  const color = colors[props.index % colors.length]
  
  return (
    <Div px={4} py={3} border="4px solid" borderColor={color} borderRadius="8px" mx="auto" mt={4} style={{maxWidth:'640px'}}>
      <Div borderBottom="1px solid" borderColor={color} color={color} py={3} mb={3} display="flex" flexWrap="wrap">
        <H2 textAlign="left" fontSize={4} fontWeight="400" width={1/2} color={color}>{props.title}</H2>
        <Div textAlign="right" fontSize={4} fontWeight="400" width={1/2} color={color}>{props.index+1} / {topicTitles.length}</Div>
      </Div>
      <Div pb={4}>
        <Div width={props.width || 180} mx="auto" textAlign="center">
          <HealthCheckIcon rating={currRating} />
        </Div>
        <Slider min={0} max={2} tooltip={false} labels={{0:'Horrible',1:'OK',2:'Awesome'}} value={currRating} onChange={value => setCurrRating(value)} />
      </Div>
      <Button 
        bg={color} color="white" fontSize={4} py={3} px={4} my={4} borderRadius="8px"
        onClick={() => {
          props.onConfirm(currRating)
          setCurrRating(1)
        }}
        children="Next"
      />
      </Div>
  )
}

HealthCheckTopic.propTypes = {
  title: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired
}

export default HealthCheckTopic
