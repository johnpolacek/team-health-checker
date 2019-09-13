/** @jsx jsx */
import { jsx } from 'theme-ui'
import PropTypes from 'prop-types'

const TopicButton = (props) => (
  <div sx={{fontSize: 3, my:2, pl:4, pr:3, py:3, border: props.checked ? 'solid 4px' : 'dashed 1px', borderColor: props.color, borderRadius:1, position: 'relative'}}>
    <span sx={{height:0, width: 0, position: 'absolute', top: props.checked ? '14px' : '12px', left: '24px', cursor: 'pointer'}}>
      <input aria-describedby={props.id+'-info'} sx={{cursor: 'pointer'}} onChange={props.onChange} checked={props.checked}  type="radio" id={props.id} name={props.name} value={props.value} />
    </span>
    <label sx={{textAlign:'left', pl:4, fontWeight: 'bold', width:300, display: 'inline-block', cursor: 'pointer'}} htmlFor={props.id}>{props.label}</label>
    { props.children && 
      <div id={props.id+'-info'} sx={{textAlign:'left', pl:4,pt:1,fontSize:0,width:300}}>{props.children}</div>
    }
  </div>
)

TopicButton.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
}

export default TopicButton