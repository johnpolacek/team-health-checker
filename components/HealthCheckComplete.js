import { Div, H2, P, A } from 'styled-system-html'
import Link from 'next/link'

export default (props) => {
  return (
    <Div textAlign="center" py={5}>
      <H2 color="base" py={5} fontSize={5}>Thanks for completing the health check!</H2>
      <P>
        <Link prefetch href={'/results/'+props.id}>
          <A href={'/check/'+props.id} bg="cyan" color="white" fontSize={4} py={3} px={4} borderRadius="8px" style={{textDecoration:'none'}}>View results</A>
        </Link>
      </P>
    </Div>
  )
}