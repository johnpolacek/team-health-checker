import { useState } from 'react';
import { Mutation } from 'react-apollo'
import { createHealthCheckMutation } from '../api/operations'
import Link from 'next/link'

export default (props) => {
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <>
      {
        id ? (
          <>
            <h2>You created a new Health Check!</h2>
            <div>
              <p>You can share it with your friends by sharing this link:</p>
              <input readonly type="text" value={window.location.href+'/check/'+id} /> 
            </div>
            <p>
              <Link prefetch href={'/check/?id='+id}>
                <a>View health check</a>
              </Link>
            </p>
          </>
        ) : (
          <Mutation 
            mutation={createHealthCheckMutation} 
            onCompleted={(data) => {setId(data.createHealthCheck.id)}}
          >
            {createMutation => <button 
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
    </>
  )
}