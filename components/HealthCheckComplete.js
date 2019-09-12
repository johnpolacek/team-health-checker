/** @jsx jsx */
import { jsx } from 'theme-ui'
import Link from 'next/link'

export default (props) => {
  return (
  	<>
	    <h2 sx={{color:'primary',pb:5}}>Thanks for completing the health check!!</h2>
	    <Link prefetch href={'/results/'+props.id}>
	      <a sx={{fontSize:4, bg:'primary', color: 'white', borderRadius:1, p:3, px:4, textDecoration:'none'}} href={'/check/'+props.id}>View results</a>
	    </Link>
	</>
  )
}