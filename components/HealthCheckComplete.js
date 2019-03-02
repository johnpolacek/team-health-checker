import Link from 'next/link'

export default (props) => {
  return (
  	<div>
	    <p>Thanks for taking health check {props.id}!</p>
	    <Link prefetch href={'/results/'+props.id}>
	      <a href={'/check/'+props.id}>View results</a>
	    </Link>
		</div>
  )
}