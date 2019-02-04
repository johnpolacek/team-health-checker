import PropTypes from 'prop-types'
import { useState } from 'react'
import { Mutation } from 'react-apollo'
import { createHealthCheckResponseMutation, getHealthCheckQuery, topicTitles } from '../api/operations'

const HealthCheck = (props) => {

  const [currRating, setCurrRating] = useState(null)
  const [ratings, setRatings] = useState([])
  const [isDone, setIsDone] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const currTopic = ratings.length
  const ratingLabels = {
    0: 'Sucky',
    1: 'OK',
    2: 'Awesome'
  }

  const onChange = e => {
    setCurrRating(parseInt(e.target.value))
  }

  const onConfirmRating = () => {
    setRatings(ratings.concat([currRating]))
    setCurrRating(null)
  }

  return (
    <>
      {
        ratings.length === topicTitles.length ? (
          <Mutation 
            mutation={createHealthCheckResponseMutation} 
            variables={{ ratings, healthCheckId: props.id }}
            onCompleted={props.onComplete}
            refetchQueries={() => {
              console.log("refetchQueries")
                return [{
                    query: getHealthCheckQuery,
                    variables: { id: props.id }
                }]
            }}
            awaitRefetchQueries={true}
          >
            {
              createMutation => {
                return (
                  <>
                    {
                      ratings.map((rating, i) => {
                        return (<div key={topicTitles[i]}>{topicTitles[i]}: {ratingLabels[rating]}</div>)
                      })
                    }
                    <button 
                      onClick={() => {
                        setLoading(true)
                        createMutation()
                      }}
                      children = {loading ? 'Saving...' : 'Confirm'}
                    />
                  </>
                )
              }
            }
          </Mutation>
        ) : (
          <>
            <h2>{topicTitles[currTopic]}</h2>
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
              onClick={onConfirmRating}
              children="Next"
            />
          </>
        )
      }
    </>
  )
}

HealthCheck.propTypes = {
  id: PropTypes.string.isRequired,
  onComplete: PropTypes.func.isRequired
}

export default HealthCheck

