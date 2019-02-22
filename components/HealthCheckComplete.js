import Link from 'next/link'

export default (props) => {
  return (
    <>
      <p>Thanks for completing the health check!</p>
      <p>
        <Link prefetch href={'/results/'+props.id}>
          <a>View health check</a>
        </Link>
      </p>
    </>
  )
}