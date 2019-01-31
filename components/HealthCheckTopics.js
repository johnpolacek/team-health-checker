import PropTypes from 'prop-types'
import { useState } from 'react'
import { topicTitles } from '../components/HealthCheckTopicData'

const HealthCheckTopics = (props) => {

  const [currRating, setCurrRating] = useState(null)
  const [ratings, setRatings] = useState([])
  const currTopic = ratings.length

  const onChange = e => {
    setCurrRating(e.target.value)
  }

  const onConfirmRating = () => {
    setRatings(ratings.concat([currRating]))
    setCurrRating(null)
  }



  return (
    <div>
      <h2>{topicTitles[currTopic]}</h2>
      <div onChange={onChange}>
        <div>
          <input checked={currRating === '2'}  type="radio" id="awesome" name="rating" value="2" />
          <label htmlFor="awesome">Awesome</label>
        </div>
        <div>
          <input checked={currRating === '1'} type="radio" id="ok" name="rating" value="1" />
          <label htmlFor="ok">OK</label>
        </div>
        <div>
          <input checked={currRating === '0'} type="radio" id="sucky" name="rating" value="0" />
          <label htmlFor="sucky">Sucky</label>
        </div>
      </div>
      <button 
        disabled={currRating == null} 
        onClick={onConfirmRating}
        children="Next"
      />
    </div>
  )
}

export default HealthCheckTopics

