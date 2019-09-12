/** @jsx jsx */
import { jsx } from 'theme-ui'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { createHealthCheckResponseMutation, getHealthCheckQuery, topics, ratingLabels } from '../api/operations'
import HealthCheckTopic from './HealthCheckTopic'
import RatingRow from './RatingRow'

const HealthCheck = (props) => {

  const [ratings, setRatings] = useState([])
  const [isDone, setIsDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const colors = ['orange','purple','cyan','pink','green','primary']
  
  const currTopic = ratings.length
  
  const onConfirmRating = (rating) => {
    setRatings(ratings.concat([rating]))
  }

  return (
    <>
      {
        ratings.length === topics.length ? (
          <Mutation
            mutation={createHealthCheckResponseMutation} 
            variables={{ ratings, healthCheckId: props.id }}
            onCompleted={props.onComplete}
            refetchQueries={() => {
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
                        return <RatingRow title={topics[i].title} rating={ratingLabels[rating]} />
                      })
                    }
                    <button 
                      sx={{mt:4}}
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
            <HealthCheckTopic color={colors[ratings.length % colors.length]} topic={topics[currTopic]} onConfirm={onConfirmRating}></HealthCheckTopic>
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