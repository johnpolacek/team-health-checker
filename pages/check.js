import React from 'react'
import App from '../components/App'

export default class extends React.Component {
  static getInitialProps ({ query: { id } }) {
    return { id }
  }

  render () {
    return <App>
      <h1>Loaded HealthCheck id: {this.props.id}</h1>
    </App>
  }
}