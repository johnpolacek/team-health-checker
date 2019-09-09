/** @jsx jsx */
import { jsx } from 'theme-ui'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { createHealthCheckResponseMutation, getHealthCheckQuery, topicTitles, ratingLabels } from '../api/operations'
import HealthCheckTopic from './HealthCheckTopic'

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
        ratings.length === topicTitles.length ? (
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
                        return (<div sx={{fontSize:3,p:2}} key={topicTitles[i]}>
                          <span sx={{display:'inline-block',width:'240px',textAlign:'right'}}>{topicTitles[i]}</span> 
                          <span sx={{pl:3,display:'inline-block',width:'240px',textAlign:'left',fontWeight:'bold'}}>{ratingLabels[rating]}</span>   
                        </div>)
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
            <HealthCheckTopic color={colors[ratings.length % colors.length]} title={topicTitles[currTopic]} onConfirm={onConfirmRating}></HealthCheckTopic>
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