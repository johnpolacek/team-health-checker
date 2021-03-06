/** @jsx jsx */
import { jsx } from 'theme-ui'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { ratingLabels } from '../api/operations'
import TopicButton from './TopicButton'

const HealthCheckTopic = (props) => {

  const [currRating, setCurrRating] = useState(null)
  
  const onRatingChange = e => {
    setCurrRating(parseInt(e.target.value))
  }

  const onRatingConfirm = e => {
    props.onConfirm(currRating)
    setCurrRating(null)
  }
  
  return (
    <>
      <h2 sx={{color:props.color, fontSize:5, pb:2}}>{props.topic.title}</h2>
      <TopicButton color={props.color} id={ratingLabels[2]} name="rating" label={ratingLabels[2]} value="2" onChange={onRatingChange} checked={currRating === 2}>{props.topic.pos}</TopicButton>
      <TopicButton color={props.color} id={ratingLabels[1]} name="rating" label={ratingLabels[1]} value="1" onChange={onRatingChange} checked={currRating === 1} />
      <TopicButton color={props.color} id={ratingLabels[0]} name="rating" label={ratingLabels[0]} value="0" onChange={onRatingChange} checked={currRating === 0}>{props.topic.pos}</TopicButton>
      <button sx={{mt:4,fontSize:3}} disabled={currRating == null} onClick={onRatingConfirm}>Next</button>
    </>
  )
}

HealthCheckTopic.propTypes = {
  topic: PropTypes.object.isRequired,
  color: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
}

export default HealthCheckTopic