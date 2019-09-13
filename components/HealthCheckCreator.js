/** @jsx jsx */
import { jsx } from 'theme-ui'
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
            <p sx={{py:4, fontSize:3}}>
              <Link prefetch href={'/check/'+id}>
                <a>View health check</a>
              </Link>
            </p>
            <div sx={{width:'100%', maxWidth:'480px', py:3}}>
              <p>You can share it with your friends by sharing this link:</p>
              <input sx={{width:'100%', p:3}} readonly type="text" value={window.location.href+'/check/'+id} /> 
            </div>
          </>
        ) : (
          <>
            <p>Health checks help you find out how your team is doing, and work together&nbsp;to&nbsp;improve.</p>
            <p sx={{pb:4}}>This health check is based on <a sx={{whiteSpace:'nowrap'}} href="https://labs.spotify.com/2014/09/16/squad-health-check-model/">Spotify’s Squad Health Check Model</a>.</p>
            <Mutation 
              mutation={createHealthCheckMutation} 
              onCompleted={(data) => {setId(data.createHealthCheck.id)}}
            >
              {
                createMutation => <button 
                  onClick={() => {
                    setLoading(true)
                    createMutation()
                  }}
                  children = {loading ? 'Loading...' : 'Create New Health Check'}
                />
              }
            </Mutation>
          </>
        )
      }
    </>
  )
}