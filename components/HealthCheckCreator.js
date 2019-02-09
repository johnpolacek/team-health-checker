import { useState } from 'react'
import { Mutation } from 'react-apollo'
import { createHealthCheckMutation } from '../api/operations'
import Link from 'next/link'
import { Div, H2, P, A, Button, Input } from 'styled-system-html'

const HealthCheckCreator = () => {
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <Div px={3}>
      {
        id ? (
          <>
            <H2 color="green" pb={4} fontSize={5} fontWeight="600">You created a new Health Check!</H2>
            <Div pb={4}>
              <P pb={3} fontSize={3}>You can share it with your friends by sharing this link:</P>
              <Input width={340} p={2} readonly type="text" value={window.location.href+'/healthcheck/'+id} /> 
            </Div>
            <P py={4}>
              <Link prefetch href={'/healthcheck/'+id}>
                <A href={'/healthcheck/'+id} bg="cyan" color="white" fontSize={4} py={3} px={4} borderRadius="8px" style={{textDecoration:'none'}}>View Health Check</A>
              </Link>
            </P>
          </>
        ) : (
          <Mutation 
            mutation={createHealthCheckMutation} 
            onCompleted={(data) => {setId(data.createHealthCheck.id)}}
          >
            {
              createMutation => <Button 
                bg="green" color="white" 
                fontSize={4} fontWeight="{2}"
                py={3} px={4} borderRadius="8px"
                onClick={() => {
                  setLoading(true)
                  createMutation()
                }}
                children = {loading ? 'Loading...' : 'Create New Health Check'}
              />
            }
          </Mutation>
        )
      }
    </Div>
  )
}

export default HealthCheckCreator

