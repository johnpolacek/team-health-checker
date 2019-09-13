/** @jsx jsx */
import { jsx } from 'theme-ui'
import PropTypes from 'prop-types'

const RatingRow = (props) => (
  <div sx={{diplay:'flex',flexWrap:'wrap',width:'100%',maxWidth:'500px',mx:'auto',fontSize:[2,2,3],py:2}} key={props.title}>
    <div sx={{color: 'gray', display:'inline-block',width:['100%','50%'],textAlign:['center','right']}}>{props.title}</div> 
    <div sx={{pl:3,display:'inline-block',width:['100%','50%'],textAlign:['center','left'],fontWeight:'bold'}}>{props.rating}</div>   
  </div>
)

RatingRow.propTypes = {
  title: PropTypes.string.isRequired,
  rating: PropTypes.string.isRequired,
}

export default RatingRow