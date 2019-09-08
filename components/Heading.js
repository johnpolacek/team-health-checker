/** @jsx jsx */
import { jsx } from 'theme-ui'

export default (props) => (
  <h1 sx={{
    fontSize:[6,7,8],
    pb:3,
    color:'primary',
    fontWeight: 400,
  }}>{props.children}</h1>
)