import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import { getHealthCheckQuery, topicTitles } from '../api/operations'

const HealthCheckResults = (props) => {

  return (
    <Query query={getHealthCheckQuery} variables={{id: props.id}}>
      {({ loading, error, data }) => {
        if (loading) return <div>Loading...</div>
        if (error || !data.HealthCheck) return <div>Error: Could not load HealthCheck with id: {this.props.id}</div>

        let topicRatings = topicTitles.map(() => { return [0,0,0] })
        const responses = data.HealthCheck.responses.forEach((response) => {
     			response.ratings.forEach((rating, topicIndex) => {
            topicRatings[topicIndex][rating]++
     			})
        })

        return (
          <Div textAlign="center" py={[4,5]} mb={[4,5]}>
            <H1 color="base" pb={3} fontSize={[5,6]} fontWeight="400">Team Health Check Results</H1>
            <P fontSize={[2,3]} pb={[3,4]}>{data.HealthCheck.responses.length} responses so far. Here are the results...</P>
            {
              topicRatings.map((topic, topicIndex) => {
                const rating = Math.round((topic[1] + (topic[2] * 2))/data.HealthCheck.responses.length)
                const color = rating === 0 ? 'red' : rating === 1 ? 'gray5' : 'green'
                return (
                  <Div display="inline-block" p={3} m={3} fontSize={4} key={'topicRating'+topicIndex} bg={color} borderRadius="8px" color="white">
                    <Div width={48} mx="auto">
                      <HealthCheckIcon fill="#fff" rating={rating} />
                    </Div>
                    <H2 width={240} mx="auto" borderBottom="solid 1px" pb={3} px={4} mb={3} borderColor="#fff" fontSize={1} fontWeight="bold">{topicTitles[topicIndex]}</H2>
                    <Div fontSize={2}>
                      <P>Awesome: {topic[2]}</P>
                      <P>OK: {topic[1]}</P>
                      <P>Sucky: {topic[0]}</P>
                    </Div>
                    <P py={2} fontSize={1} fontStyle="italic">( avg <Span fontSize={0}>{((topic[1] + (topic[2] * 2))/data.HealthCheck.responses.length).toFixed(2)}</Span> )</P>
                  </Div>
                )
              })
            }
          </Div>
        )
      }}
    </Query>
  )
}

HealthCheckResults.propTypes = {
  id: PropTypes.string.isRequired
}

export default HealthCheckResults