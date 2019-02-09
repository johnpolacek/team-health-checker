import PropTypes from 'prop-types'
import { useState } from 'react'
import { Div, H2, Input, Label, Button } from 'styled-system-html'

const HealthCheckTopic = (props) => {

  const [currRating, setCurrRating] = useState(null)
  
  const ratingLabels = {
    0: 'Sucky',
    1: 'OK',
    2: 'Awesome'
  }

  const onChange = e => {
    setCurrRating(parseInt(e.target.value))
  }

  return (
    <Div p={3} border="2px solid" borderColor="orange" borderRadius="8px" maxWidth="480px">
      <h2>{props.title}</h2>
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
        onClick={props.onConfirm}
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
