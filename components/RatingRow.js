/** @jsx jsx */
import { jsx } from 'theme-ui'
import PropTypes from 'prop-types'

const RatingRow = (props) => (
  <div sx={{fontSize:3,p:2}} key={props.title}>
    <span sx={{color: 'gray', display:'inline-block',width:'240px',textAlign:'right'}}>{props.title}</span> 
    <span sx={{pl:3,display:'inline-block',width:'240px',textAlign:'left',fontWeight:'bold'}}>{props.rating}</span>   
  </div>
)

RatingRow.propTypes = {
  title: PropTypes.string.isRequired,
  rating: PropTypes.string.isRequired,
}

export default RatingRow