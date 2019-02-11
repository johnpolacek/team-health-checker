import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import HealthCheckIcon from './HealthCheckIcon'
import { getHealthCheckQuery, topicTitles } from '../api/operations'
import { Div, H1, H2, P } from 'styled-system-html'

const colors = ['orange','purple','cyan','pink']

const HealthCheckComplete = (props) => {

  return (
    <Query query={getHealthCheckQuery} variables={{id: props.id}}>
      {({ loading, error, data }) => {
      	console.log('HealthCheckComplete data',data)
        if (loading) return <div>Loading...</div>
        if (error || !data.HealthCheck) return <div>Error: Could not load HealthCheck with id: {this.props.id}</div>

        let topicRatings = topicTitles.map(() => { return [0,0,0] })
        const responses = data.HealthCheck.responses.forEach((response) => {
     			response.ratings.forEach((rating, topicIndex) => {
     				topicRatings[topicIndex][rating]++
     			})
        })

        return (
          <Div textAlign="center" py={4}>
            <H1 color="base" pt={4} pb={3} fontSize={6} fontWeight="400">Health Check Complete!</H1>
          	<P fontSize={3} pb={4}>{data.HealthCheck.responses.length} responses so far. Here are the results...</P>
          	{
          		topicRatings.map((topic, topicIndex) => 
          			<Div pb={4} fontSize={4} key={'topicRating'+topicIndex}>
          				<H2 width={240} mx="auto" borderBottom="solid 1px" pb={2} mb={3} borderColor={colors[topicIndex % colors.length]} fontSize={3} color={colors[topicIndex % colors.length]}>{topicTitles[topicIndex]}</H2>
          				<Div width={72} mx="auto">
                    <HealthCheckIcon rating={Math.round((topic[1] + (topic[2] * 2))/data.HealthCheck.responses.length)} />
                  </Div>
                  <P pb={2} fontSize={1}>( average {((topic[1] + (topic[2] * 2))/data.HealthCheck.responses.length).toFixed(2)} )</P>
                  <P>Awesome: {topic[2]}</P>
                  <P>OK: {topic[1]}</P>
                  <P>Sucky: {topic[0]}</P>
          			</Div>
          		)
          	}
          </Div>
        )
      }}
    </Query>
  )
}

HealthCheckComplete.propTypes = {
  id: PropTypes.string.isRequired
}

export default HealthCheckComplete

