import React from 'react'
import App from '../components/App'
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
  static getInitialProps ({ query: { id } }) {
    return { id }
  }

  render () {
    return <App>
      <Query query={HEALTHCHECK_QUERY} variables={{id: this.props.id}}>
        {({ loading, error, data }) => {
          if (loading) return <div>Fetching...</div>
          if (error) return <div>Error: Could not load HealthCheck with id: {this.props.id}</div>
          console.log(data)
          return (
            <h1>Loaded HealthCheck id: {this.props.id}</h1>
          )
        }}
      </Query>
    </App>
  }
}

// "cjrihdw8l00ha01092h7nloha"