import PropTypes from 'prop-types'
import { useState } from 'react'
import { Mutation } from 'react-apollo'
import { createHealthCheckResponseMutation, getHealthCheckQuery, topicTitles } from '../api/operations'
import HealthCheckTopic from './HealthCheckTopic'
import { Div, H1 } from 'styled-system-html'

const HealthCheck = (props) => {

  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(false)
  
  const currTopic = ratings.length
  
  const onConfirmRating = () => {
    setRatings(ratings.concat([currRating]))
    setCurrRating(null)
  }

  return (
    <Div textAlign="center">
      <H1 color="base" pt={4} pb={3} fontSize={8} fontWeight="400">Team Health Checker</H1>
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
          <HealthCheckTopic title={topicTitles[currTopic]} onConfirm={onConfirmRating} />
        )
      }
    </Div>
  )
}

HealthCheck.propTypes = {
  id: PropTypes.string.isRequired,
  onComplete: PropTypes.func.isRequired
}

export default HealthCheck

