/** @jsx jsx */
import { jsx } from 'theme-ui'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import { getHealthCheckQuery, topics } from '../api/operations'
import theme from './Theme'
import Heading from './Heading'
import HealthCheckIcon from './HealthCheckIcon'

const RatingBadge = (props) => <span sx={{display:'inline-block', position:'relative', top: '-3px', fontSize:3, mx:1, width:'52px', py:'12px', bg:props.color, color:'white', borderRadius:1}}>{props.children}</span>

const HealthCheckResults = (props) => {

  return (
    <Query query={getHealthCheckQuery} variables={{id: props.id}}>
      {({ loading, error, data }) => {
        if (loading) return <div>Loading...</div>
        if (error || !data.HealthCheck) return <div>Error: Could not load HealthCheck with id: {this.props.id}</div>

        let topicRatings = topics.map(() => { return [0,0,0] })
        const responses = data.HealthCheck.responses.forEach((response) => {
     			response.ratings.forEach((rating, topicIndex) => {
            topicRatings[topicIndex][rating]++
     			})
        })

        const numResponsesText = data.HealthCheck.responses.length + ' response' + (data.HealthCheck.responses.length > 1 ? 's' : '') + ' so far'

        return (
          <div sx={{textAlign:'center', width:'100%'}}>
          	<Heading>Health Check Results</Heading>
            <p sx={{color:'gray', fontStyle:'italic'}}>{numResponsesText}</p>
          	{
          		topicRatings.map((topic, topicIndex) => {
                const rating = Math.round((topic[1] + (topic[2] * 2))/data.HealthCheck.responses.length)
                const color = rating === 0 ? 'red' : rating === 1 ? 'gray' : 'green'
          			return (
                  <div sx={{display:'flex', flexWrap: 'wrap', border: 'solid 1px', borderColor:'#ddd', pt:3, pb:'13px', px:2, fontSize:5, mb:'-1px', width:'100%',maxWidth:'800px',mx:'auto'}} key={'topicRating'+topicIndex}>
                    <div sx={{width:['100%','100%','50%'], pb:[3,3,0], pt:1,color, pl:[0,0,4], display:'inline-block', textAlign: 'center', fontWeight: 'bold'}}>{topics[topicIndex].title}</div>
                    <div sx={{width:['100%','100%','50%'], textAlign: 'center'}}>
                      <RatingBadge color="red">{topic[0]}</RatingBadge>
                      <RatingBadge color="gray">{topic[1]}</RatingBadge>
                      <RatingBadge color="green">{topic[2]}</RatingBadge>
                      <span sx={{pl:'48px', pr:4, py:0, position: 'relative'}}><span sx={{position:'absolute', top:0, left:'27px'}}><HealthCheckIcon fill={theme.colors[color]} size={48} rating={rating} /></span></span>
                    </div>
            			</div>
                )
              })
          	}
          </div>
        )
      }}
    </Query>
  )
}

HealthCheckResults.propTypes = {
  id: PropTypes.string.isRequired
}

export default HealthCheckResults