import PropTypes from 'prop-types'
import { useState } from 'react'
import { Mutation } from 'react-apollo'
import { createHealthCheckResponseMutation, getHealthCheckQuery, topicTitles, ratingLabels } from '../api/operations'
import HealthCheckTopic from './HealthCheckTopic'
import HealthCheckIcon from './HealthCheckIcon'
import Button from './Button.js'
import { Div, H1, H2 } from 'styled-system-html'

const HealthCheck = (props) => {

  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(false)
  
  const currTopic = ratings.length
  
  const onConfirmRating = (rating) => {
    setRatings(ratings.concat([rating]))
  }

  return (
    <Div textAlign="center" py={4}>
      <H1 color="base" pb={3} fontSize={5}>Team Health Check</H1>
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
                    <Div width={1100} mx="auto">
                      {
                        ratings.map((rating, i) => {
                          const color = rating === 0 ? 'red' : rating === 1 ? 'gray5' : 'green'
                          return (
                            <Div width={240} display="inline-block" py={4} px={3} m={3} fontSize={3} key={'topicRating'+i} bg={color} borderRadius="8px" color="white">
                              <Div width={36} mx="auto" pb={2}>
                                <HealthCheckIcon fill="#fff" rating={rating} />
                              </Div>
                              <H2 fontSize={2}>{topicTitles[i]}</H2>
                            </Div>
                          )
                        })
                      }
                    </Div>
                    <Button 
                      bg={loading ? 'gray' : 'green'} color="white" fontSize={4} py={3} px={4} my={4} borderRadius="8px"
                      disabled={loading}
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
