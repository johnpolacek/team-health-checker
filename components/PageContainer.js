/** @jsx jsx */
import { jsx } from 'theme-ui'

export default (props) => (
  <div sx={{
    minHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    pt: 4,
    px: [3,4],
    pb: 5,
  }}>{props.children}</div>
)