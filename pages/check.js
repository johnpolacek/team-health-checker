import React from 'react'
import App from '../components/App'
import HealthCheck from '../components/HealthCheck'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const HEALTHCHECK_QUERY = gql`query HealthCheck($id: ID!) {
  HealthCheck(id: $id) {
    id
    responses {
      id
    }
  }
}`

export default class extends React.Component {

  constructor(props) {
    super(props)

    this.views = {
      READY: 'READY',
      IN_PROGRESS: 'IN_PROGRESS',
      COMPLETE: 'COMPLETE'
    }

    this.state = {
      view: this.views.READY
    }
  }

  static getInitialProps ({ query: { id } }) {
    return { id }
  }

  render () {
    
    return <App>
      <Query query={HEALTHCHECK_QUERY} variables={{id: this.props.id}}>
        {({ loading, error, data }) => {
          if (loading) return <div>Loading...</div>
          if (error || !data.HealthCheck) return <div>Error: Could not load HealthCheck with id: {this.props.id}</div>
          return (
            <>
              {{
                READY: <>
                  <button onClick={() => this.setState({view: this.views.IN_PROGRESS})}>Begin health check</button>
                </>,
                IN_PROGRESS: <HealthCheck id={this.props.id} onComplete={(data) => {
                  console.log('COMPLETE!', data)
                  this.setState({view: this.views.COMPLETE})}} 
                />,
                COMPLETE: <p>Thanks for completing the health check!</p>
              }[this.state.view]}
            </>
          )
        }}
      </Query>
    </App>
  }
}