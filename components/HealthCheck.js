import PropTypes from 'prop-types'
import { useState } from 'react'
import { Mutation } from 'react-apollo'
import { createHealthCheckResponseMutation, getHealthCheckQuery, topicTitles } from '../api/operations'
import HealthCheckTopic from './HealthCheckTopic'
import HealthCheckIcon from './HealthCheckIcon'
import { Div, H1, Span, Button } from 'styled-system-html'

export const ratingLabels = {
  0: 'Sucky',
  1: 'OK',
  2: 'Awesome'
}

const HealthCheck = (props) => {

  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(false)
  
  const currTopic = ratings.length
  
  const onConfirmRating = (rating) => {
    setRatings(ratings.concat([rating]))
  }

  return (
    <Div textAlign="center" py={4}>
      <H1 color="base" pt={4} pb={3} fontSize={6} fontWeight="400">Team Health Check</H1>
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
                        return (<Div py={2} fontSize={3} key={topicTitles[i]}>{topicTitles[i]}: <Span display="inline-block" width={32} position="relative" top="9px"><HealthCheckIcon rating={rating} /></Span></Div>)
                      })
                    }
                    <Button 
                      bg="green" color="white" fontSize={4} py={3} px={4} my={4} borderRadius="8px"
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
          <HealthCheckTopic title={topicTitles[currTopic]} onConfirm={onConfirmRating} index={ratings.length} />
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

