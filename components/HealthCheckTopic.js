/** @jsx jsx */
import { jsx } from 'theme-ui'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { topicTitles, ratingLabels } from '../api/operations'

const HealthCheckTopic = (props) => {

  const [currRating, setCurrRating] = useState(1)
  

  const onChange = e => {
    setCurrRating(parseInt(e.target.value))
  }
  
  return (
    <>
      <h2 sx={{color:'pink'}}>{props.title}</h2>
      <div onChange={onChange}>
        <div>
          <input onChange={() => {}} checked={currRating === 2}  type="radio" id={ratingLabels[2]} name="rating" value="2" />
          <label htmlFor={ratingLabels[2]}>{ratingLabels[2]}</label>
        </div>
        <div>
          <input onChange={() => {}} checked={currRating === 1} type="radio" id={ratingLabels[1]} name="rating" value="1" />
          <label htmlFor={ratingLabels[1]}>{ratingLabels[1]}</label>
        </div>
        <div>
          <input onChange={() => {}} checked={currRating === 0} type="radio" id={ratingLabels[0]} name="rating" value="0" />
          <label htmlFor={ratingLabels[0]}>{ratingLabels[0]}</label>
        </div>
      </div>
      <button 
        disabled={currRating == null} 
        onClick={() => props.onConfirm(currRating)}
        children="Next"
      />
    </>
  )
}

HealthCheckTopic.propTypes = {
  title: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired
}

export default HealthCheckTopic