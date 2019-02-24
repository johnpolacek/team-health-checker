import { useState } from 'react'
import { Mutation } from 'react-apollo'
import { createHealthCheckMutation } from '../api/operations'
import Link from 'next/link'
import { Div, H2, P, A, Input } from 'styled-system-html'
import Button from './Button'

const HealthCheckCreator = () => {
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <>
      {
        id ? (
          <>
            <H2 color="green" pb={4} fontSize={[4,5]} fontWeight="600">You created a new Health Check!</H2>
            <P py={3}>
              <Link prefetch href={'/check/'+id}>
                <A href={'/check/'+id} color="base" fontSize={[3,4]}>Go To Health Check</A>
              </Link>
            </P>
            <Div py={4} mb={4}>
              <P pb={3} fontSize={[2,3]}>You can share it with your friends via&nbsp;this&nbsp;link:</P>
              <Input width={340} fontSize={[0,1,2]} p={2} readonly type="text" value={window.location.href+'check/'+id} /> 
            </Div>
          </>
        ) : (
          <Mutation 
            mutation={createHealthCheckMutation} 
            onCompleted={(data) => {setId(data.createHealthCheck.id)}}
          >
            {
              createMutation => <Button 
                disabled={loading}
                bg={loading ? 'gray' : 'green'} color="white" 
                onClick={() => {
                  if (!loading) {
                    setLoading(true)
                    createMutation()
                  }
                }}
                children = {loading ? 'Loading...' : 'Create New Health Check'}
              />
            }
          </Mutation>
        )
      }
    </>
  )
}

export default HealthCheckCreator

