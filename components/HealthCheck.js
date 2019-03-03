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
      <H1 color="base" pb={3} fontSize={[4,5]}>Team Health Check</H1>
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
                    <Div width={[1,1,1,1,1100]} mx="auto" px={[2,3]}>
                      {
                        ratings.map((rating, i) => {
                          const color = rating === 0 ? 'red' : rating === 1 ? 'gray5' : 'green'
                          return (
                            <Div display="inline-block" px={[1,2,2]} py={['2px',2,2]}>
                              <Div width={[100,120,200,240]} py={3} px={[1,2,3]} fontSize={[1,3]} key={'topicRating'+i} bg={color} borderRadius="8px" color="white" style={{overflow:'hidden'}}>
                                <Div width={[24,36]} mx="auto">
                                  <HealthCheckIcon fill="#fff" rating={rating} />
                                </Div>
                                <H2 height={[30,30,'auto']} fontSize={[0,1,2]}>{topicTitles[i]}</H2>
                              </Div>
                            </Div>
                          )
                        })
                      }
                    </Div>
                    <Button 
                      bg={loading ? 'gray' : 'green'} color="white" fontSize={3} p={5} my={5} borderRadius="8px"
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