/** @jsx jsx */
import { jsx } from 'theme-ui'

export default (props) => (
  <div sx={{
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    px: 4,
    pb: 5,
  }}>{props.children}</div>
)